import { 
  Facebook, Instagram, Linkedin, Twitter, Youtube, 
  Mail, MessageCircle, Share2, Send, 
} from "lucide-react";

export const platforms = [
  { name: "Facebook", utmSource: "facebook", Icon: Facebook, color: "#1877F2" },
  { name: "Instagram", utmSource: "instagram", Icon: Instagram, color: "#E4405F" },
  { name: "WhatsApp", utmSource: "whatsapp", Icon: MessageCircle, color: "#25D366" },
  { name: "LinkedIn", utmSource: "linkedin", Icon: Linkedin, color: "#0077B5" },
  { name: "X (Twitter)", utmSource: "twitter", Icon: Twitter, color: "#ffffff" },
  { name: "YouTube", utmSource: "youtube", Icon: Youtube, color: "#FF0000" },
  { name: "Telegram", utmSource: "telegram", Icon: Send, color: "#0088CC" },
  { name: "Email", utmSource: "email", Icon: Mail, color: "#EA4335" }, // Google Red
  { name: "Other", utmSource: "manual", Icon: Share2, color: "#71717A" }, // Zinc/Gray
];