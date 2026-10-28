import html from "../../assets/technologies/html.svg";
import css from "../../assets/technologies/css.svg";
import javascript from "../../assets/technologies/javascript.svg";
import bootstrap from "../../assets/technologies/bootstrap.svg";
import vite from "../../assets/technologies/vite.svg";
import gsap from "../../assets/technologies/gsap.svg";
import nodejs from "../../assets/technologies/nodejs.svg";
import express from "../../assets/technologies/express.svg";
import supabase from "../../assets/technologies/supabase.svg";
import postgresql from "../../assets/technologies/postgresql.svg";
import mysql from "../../assets/technologies/mysql.svg";
import maplibre from "../../assets/technologies/maplibre.svg";
import cloudinary from "../../assets/technologies/cloudinary.svg";
import upstash from "../../assets/technologies/upstash.svg";
import nodemailer from "../../assets/technologies/nodemailer.png";
import git from "../../assets/technologies/git.svg";
import github from "../../assets/technologies/github.svg";
import docker from "../../assets/technologies/docker.svg";
import vscode from "../../assets/technologies/vscode.svg";
import androidstudio from "../../assets/technologies/androidstudio.svg";
import render from "../../assets/technologies/render.svg";
import hostinger from "../../assets/technologies/hostinger.svg";
import cloudflare from "../../assets/technologies/cloudflare.svg";
import chatgpt from "../../assets/technologies/chatgpt.svg";
import claude from "../../assets/technologies/claude.svg";
import php from "../../assets/technologies/php.svg";
import java from "../../assets/technologies/java.svg";
import csharp from "../../assets/technologies/csharp.svg";
import react from "../../assets/technologies/react.svg";
import n8n from "../../assets/technologies/n8n.svg";

export const toolkitGroups = [
  {
    id: "frontend",
    name: "Frontend",
    description: "Responsive web design, UI/UX and interactive pages.",
    tools: [
      { name: "HTML", logo: html },
      { name: "CSS", logo: css },
      { name: "JavaScript", logo: javascript },
      { name: "Bootstrap", logo: bootstrap },
      { name: "Vite", logo: vite },
      { name: "GSAP", logo: gsap, wide: true },
    ],
  },
  {
    id: "backend-data",
    name: "Backend & data",
    description: "REST APIs, authentication, database design, PostGIS, RLS and cron jobs.",
    tools: [
      { name: "Node.js", logo: nodejs },
      { name: "Express", logo: express },
      { name: "Supabase", logo: supabase },
      { name: "PostgreSQL", logo: postgresql },
      { name: "MySQL", logo: mysql },
    ],
  },
  {
    id: "maps-integrations",
    name: "Maps & integrations",
    description: "MapTiler, OpenStreetMap and OSRM for map services and routing. Hostinger Mail API for email.",
    tools: [
      { name: "MapLibre", logo: maplibre },
      { name: "Cloudinary", logo: cloudinary },
      { name: "Upstash Redis", logo: upstash },
      { name: "Nodemailer", logo: nodemailer, wide: true },
    ],
  },
  {
    id: "tools-deployment",
    name: "Tools & deployment",
    description: "Version control, development tools and web hosting.",
    tools: [
      { name: "Git", logo: git },
      { name: "GitHub", logo: github },
      { name: "Docker", logo: docker },
      { name: "VS Code", logo: vscode },
      { name: "Android Studio", logo: androidstudio },
      { name: "Render", logo: render },
      { name: "Hostinger", logo: hostinger },
      { name: "Cloudflare", logo: cloudflare },
    ],
  },
  {
    id: "ai-tools",
    name: "AI tools",
    description: "Tools I use for planning, learning, and coding support.",
    tools: [
      { name: "ChatGPT", logo: chatgpt },
      { name: "Claude", logo: claude },
    ],
  },
];

// Learning tools stay separate from the project toolkit.
export const learningTools = [
  { name: "React", logo: react, description: "Learning through this portfolio." },
  { name: "n8n", logo: n8n, description: "Exploring workflow automation." },
];

export const workingKnowledge = [
  { name: "PHP", logo: php },
  { name: "Java", logo: java },
  { name: "C#", logo: csharp },
];
