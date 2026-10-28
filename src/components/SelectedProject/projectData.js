import desktop from "../../assets/projects/snapbox/browse-desktop.png";
import phone from "../../assets/projects/snapbox/map-mobile.png";
import map from "../../assets/projects/snapbox/map-desktop.png";
import messages from "../../assets/projects/snapbox/messages-desktop.png";
import booking from "../../assets/projects/snapbox/booking-desktop.png";
import offerings from "../../assets/projects/snapbox/offerings-desktop.png";
import auth from "../../assets/projects/snapbox/auth-desktop.png";
import team from "../../assets/projects/snapbox/team-desktop.png";

// Keep the project content separate from its presentation.
export const snapboxProject = {
  id: "snapbox",
  name: "SnapBox",
  type: "Capstone project",
  description: "Photobooth booking and management",
  summary:
    "A capstone project that connects people looking for photobooth services with the businesses offering them.",
  role: "Project Lead · Full-Stack Developer · QA",
  period: "2025-2026",
  url: "https://snapboxph.com",
  desktop,
  phone,
  desktopAlt: "SnapBox's desktop browsing page.",
  phoneAlt: "SnapBox's 2D map with photobooth locations on a phone.",
  overviewTitle: ["One platform.", "Two sides of the experience."],
  contributions: [
    "I was one of the main backend developers and designed most of the database. I also worked on the UI for several pages. As project lead, I was mainly responsible for planning the system’s direction and UI/UX, and researching technologies to use.",
    "I was also one of the main QA contributors, helping test and debug the system and keep the UI consistent across pages.",
  ],
  learning: {
    title: ["What this project taught me."],
    summary: "I learned why planning matters, how to work through setbacks, and how much I enjoy trying new technologies. It was my hardest project so far, and I’m taking those lessons with me into OJT.",
    paragraphs: [
      "Before this project, I usually went straight into coding. I thought planning would only take up time that I could spend building. But when we started running into problems and relying on workarounds, I understood why planning mattered. I learned to appreciate wireframes, prototypes, and taking time to think through how things should work before writing the code.",
      "This was my hardest project so far. It took nearly a year, and balancing it with classes was exhausting at times. Some nights meant very little sleep before another early class. There were moments when I felt stuck and wanted to stop. I’m glad I kept going, but looking back, I also wish I had understood earlier how much realistic planning and a manageable pace could help.",
      "Along the way, I learned about Node.js, Supabase, PostgreSQL, authentication, realtime updates, webhooks, web hosting, and other technologies. I also learned to use Claude and ChatGPT to understand unfamiliar topics, compare tools, and explore possible approaches. I found it fulfilling to try something unfamiliar, struggle with it for a while, and eventually understand how to make it work.",
      "Even with the difficult parts, this project gave me experiences and memories I’m grateful for. It helped me discover how much I enjoy learning and building things. As I move into OJT, I hope to bring those lessons with me, contribute what I can, and keep learning from the people I work with.",
    ],
  },
  tools: ["JavaScript", "Node.js", "Express", "PostgreSQL", "Supabase"],
  stack: {
    preview: ["javascript", "nodejs", "express", "supabase", "postgresql", "cloudinary"],
    highlights: ["Auth & permissions", "Realtime updates", "2D mapping", "Edge Functions"],
    groups: [
      {
        name: "Frontend",
        technologies: ["html", "css", "javascript", "bootstrap"],
        description: "Responsive pages and interactive customer, business, and admin interfaces.",
      },
      {
        name: "Backend & data",
        technologies: ["nodejs", "express", "supabase", "postgresql"],
        description: "REST APIs, database functions, and PostGIS location queries connect the application.",
      },
      {
        name: "Media, maps & hosting",
        technologies: ["cloudinary", "maplibre", "hostinger"],
        description: "Media delivery, interactive maps, and Hostinger website and email hosting.",
      },
    ],
    capabilities: [
      {
        title: "Authentication & access",
        description: "Supabase Auth supports Google sign-in and account verification. Team permissions and Row Level Security control access to business tools and data.",
      },
      {
        title: "Realtime communication",
        description: "Private Supabase channels connect messaging and booking updates, including message delivery, read receipts, and presence.",
      },
      {
        title: "Maps & location",
        description: "MapLibre maps bring together location search, nearby booths, and date availability. PostGIS queries and route distances support discovery and travel fees.",
      },
      {
        title: "APIs & Edge Functions",
        description: "Express REST endpoints and PostgreSQL functions handle application workflows. Supabase's PostgREST API connects data, while Edge Functions support PDF invoices and SMS.",
      },
      {
        title: "Media & reporting",
        description: "Cloudinary handles uploaded media and galleries. The system also creates PDF invoices, booking and sales reports, Excel exports, and gallery downloads.",
      },
      {
        title: "Notifications & cron jobs",
        description: "Email and SMS booking updates, with cron jobs for expired payment holds and booking completion.",
      },
    ],
  },
  scenes: [
    {
      id: "signin",
      label: "Sign in",
      title: "Sign up or log in",
      description: "Access an account using email or Google.",
      image: auth,
      imageWidth: 1280,
      imageHeight: 800,
      alt: "SnapBox's sign-in and signup form with Google and email options.",
      caption: "Sign up and log in",
      source: "Live website capture, October 28, 2026",
    },
    {
      id: "discover",
      label: "Discover",
      title: "Browse photobooths",
      description:
        "View photobooth listings and locations.",
      image: map,
      imageWidth: 1280,
      imageHeight: 800,
      alt: "SnapBox's public map with photobooth listings and price markers.",
      caption: "Photobooth listings and map",
      source: "Live website capture, October 28, 2026",
    },
    {
      id: "message",
      label: "Message",
      title: "Message a business",
      description:
        "Ask about services and booking details.",
      image: messages,
      imageWidth: 1280,
      imageHeight: 800,
      alt: "SnapBox's direct messaging page with a customer-business conversation.",
      caption: "Direct messaging",
      source: "Live website capture, October 28, 2026",
    },
    {
      id: "book",
      label: "Book",
      title: "Request a booking",
      description:
        "Choose a schedule and package, then send a request.",
      detailLead: "Payment workflows are simulated for this capstone.",
      detail:
        "Customers submit payment proof for business review.",
      image: booking,
      imageWidth: 1280,
      imageHeight: 800,
      alt: "SnapBox's scheduling form with a date selector, booking details, and package options.",
      caption: "Booking form",
      source: "Live website capture, October 28, 2026",
    },
    {
      id: "manage",
      label: "Manage",
      title: "Manage services and bookings",
      description:
        "Update offerings, schedules, bookings, and messages.",
      image: offerings,
      imageWidth: 1280,
      imageHeight: 800,
      alt: "SnapBox's Business Offerings page for managing reusable package add-ons.",
      caption: "Business offerings",
      source: "Live website capture, October 28, 2026",
    },
    {
      id: "team",
      label: "Team",
      title: "Invite employees",
      description: "Invite employees by email and choose what they can manage.",
      image: team,
      imageWidth: 1280,
      imageHeight: 800,
      alt: "SnapBox's employee invitation form with an email field and permission controls.",
      caption: "Employee invitations and permissions",
      source: "Live website capture, October 28, 2026",
    },
  ],
};

// Add another real project here to give it the same showcase and shared overlay.
export const projects = [snapboxProject];
