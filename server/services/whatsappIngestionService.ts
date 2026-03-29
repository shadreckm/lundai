import { AiSearchService } from "./aiSearchService.js";
import { ListingDiscoveryService } from "./listingDiscoveryService.js";

interface WhatsAppMessage {
  from: string;
  to: string;
  body: string;
  mediaUrls?: string[];
  twilioSid?: string;
}

interface ExtractedListing {
  title?: string;
  description?: string;
  city?: string;
  price?: string;
  type?: string;
  bedrooms?: number;
  amenities?: string[];
  isFurnished?: boolean;
  address?: string;
}

export class WhatsAppIngestionService {
  static HELP_TEXT = `🏠 *LUNDAI WhatsApp Bot*

Welcome! I help landlords list student housing.

*Commands:*
• Send _LIST_ to start adding a new listing
• Send _HELP_ for this menu
• Send _STATUS_ to check your listing status

To list a property, just describe it naturally, e.g.:
_"I have a self-contained room in Zomba near Chancellor College. Available Feb. Price 25,000 MWK/month. WiFi included."_

Our AI will extract the details automatically! 🤖`;

  static async processIncomingMessage(msg: WhatsAppMessage) {
    const body = msg.body.trim().toUpperCase();

    if (body === "HELP" || body === "HI" || body === "HELLO") {
      return {
        replyMessage: this.HELP_TEXT,
        action: "help",
      };
    }

    if (body === "STATUS") {
      return {
        replyMessage: "📊 Your listing status check is being processed. Check back in a moment.",
        action: "status",
      };
    }

    // Try to extract listing from natural language
    const extracted = await this.extractListingData(msg.body);

    if (extracted.title || extracted.description) {
      try {
        // Auto-create a pending listing
        const listing = await ListingDiscoveryService.createListing({
          landlordId: "whatsapp-" + msg.from.replace(/\D/g, ""),
          title: extracted.title || "Property from WhatsApp",
          description: extracted.description || msg.body,
          type: (extracted.type as any) || "room",
          price: extracted.price || "0",
          currency: "MWK",
          address: extracted.address || "To be confirmed",
          city: extracted.city || "Malawi",
          country: "Malawi",
          bedrooms: extracted.bedrooms || 1,
          bathrooms: 1,
          amenities: extracted.amenities || [],
          isFurnished: extracted.isFurnished || false,
          nearbyUniversities: [],
          latitude: null,
          longitude: null,
          availableFrom: null,
          aiSummary: null,
          whatsappSourceId: null,
          status: "pending",
          viewCount: 0,
          isVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          replyMessage: `✅ *Listing received!*\n\nTitle: ${listing.title}\nCity: ${extracted.city || "TBC"}\nPrice: ${extracted.price || "TBC"} MWK/month\n\nOur team will review and verify your listing within 24 hours. You'll receive a confirmation here.`,
          action: "listing_created",
          listingId: listing.id,
          extracted,
        };
      } catch (err) {
        console.error("WhatsApp listing creation error:", err);
      }
    }

    return {
      replyMessage: `👋 Thanks for your message! Send *HELP* to see how to list your property on LUNDAI.`,
      action: "unknown",
    };
  }

  private static async extractListingData(text: string): Promise<ExtractedListing> {
    const result: ExtractedListing = {};

    // Simple regex-based extraction as fallback (no AI needed)
    const priceMatch = text.match(/(\d[\d,]*)\s*(?:MWK|kwacha|K|per month|\/month)/i);
    if (priceMatch) result.price = priceMatch[1].replace(/,/g, "");

    const cityMatch = text.match(/\b(zomba|blantyre|lilongwe|mzuzu)\b/i);
    if (cityMatch) result.city = cityMatch[1];

    const bedroomMatch = text.match(/(\d)\s*(?:bedroom|bed|room)/i);
    if (bedroomMatch) result.bedrooms = parseInt(bedroomMatch[1]);

    if (/furnished/i.test(text)) result.isFurnished = true;
    if (/wifi|wi-fi|internet/i.test(text)) {
      result.amenities = [...(result.amenities || []), "WiFi"];
    }
    if (/generator/i.test(text)) {
      result.amenities = [...(result.amenities || []), "Generator"];
    }
    if (/security/i.test(text)) {
      result.amenities = [...(result.amenities || []), "Security"];
    }

    if (/studio/i.test(text)) result.type = "studio";
    else if (/apartment|flat/i.test(text)) result.type = "apartment";
    else if (/hostel/i.test(text)) result.type = "hostel";
    else if (/shared/i.test(text)) result.type = "shared";
    else result.type = "room";

    // Use first 100 chars as title basis
    const firstLine = text.split(/[.\n]/)[0].trim();
    result.title = firstLine.length > 10 ? firstLine.substring(0, 80) : "Property Listing";
    result.description = text;

    return result;
  }
}
