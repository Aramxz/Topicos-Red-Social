import { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const nodes = [
  { id: "nose", x: 130, y: 60 },
  { id: "forehead", x: 145, y: 65 },
  { id: "backHead", x: 155, y: 60 },
  { id: "earTip", x: 152, y: 45 },
  { id: "muzzle", x: 120, y: 70 },
  { id: "throat", x: 150, y: 95 },
  { id: "maneTop", x: 165, y: 75 },
  { id: "maneMid", x: 180, y: 95 },
  { id: "throatBottom", x: 155, y: 115 },
  { id: "frontShoulder", x: 185, y: 130 },
  { id: "frontElbowL", x: 145, y: 125 },
  { id: "frontWristL", x: 115, y: 105 },
  { id: "frontHoofL", x: 95, y: 110 },
  { id: "frontElbowR", x: 160, y: 150 },
  { id: "frontWristR", x: 135, y: 140 },
  { id: "frontHoofR", x: 115, y: 145 },
  { id: "spineMid", x: 215, y: 135 },
  { id: "spineLow", x: 240, y: 150 },
  { id: "underbelly", x: 210, y: 180 },
  { id: "hip", x: 265, y: 170 },
  { id: "hindKneeL", x: 275, y: 205 },
  { id: "hindHockL", x: 265, y: 240 },
  { id: "hindHoofL", x: 275, y: 280 },
  { id: "hindKneeR", x: 245, y: 210 },
  { id: "hindHockR", x: 230, y: 245 },
  { id: "hindHoofR", x: 235, y: 280 },
  { id: "tailBase", x: 275, y: 175 },
  { id: "tailMid", x: 290, y: 210 },
  { id: "tailTip", x: 280, y: 255 }
];

const connections = [
  // Head
  ["nose", "forehead"], ["forehead", "backHead"], ["backHead", "throat"], ["throat", "muzzle"], ["muzzle", "nose"],
  ["earTip", "forehead"], ["earTip", "backHead"],
  // Neck
  ["forehead", "maneTop"], ["maneTop", "maneMid"], ["maneMid", "frontShoulder"],
  ["throat", "throatBottom"], ["throatBottom", "frontShoulder"],
  ["maneTop", "throat"], ["maneMid", "throatBottom"],
  // Left Front Leg
  ["frontShoulder", "frontElbowL"], ["frontElbowL", "frontWristL"], ["frontWristL", "frontHoofL"],
  // Right Front Leg
  ["frontShoulder", "frontElbowR"], ["frontElbowR", "frontWristR"], ["frontWristR", "frontHoofR"],
  // Spine
  ["frontShoulder", "spineMid"], ["spineMid", "spineLow"], ["spineLow", "hip"],
  // Belly
  ["throatBottom", "underbelly"], ["underbelly", "hindKneeR"],
  // Left Hind Leg
  ["hip", "hindKneeL"], ["hindKneeL", "hindHockL"], ["hindHockL", "hindHoofL"],
  ["spineLow", "hindKneeL"],
  // Right Hind Leg
  ["spineLow", "hindKneeR"], ["hindKneeR", "hindHockR"], ["hindHockR", "hindHoofR"],
  ["underbelly", "hindKneeR"],
  // Hip Support
  ["hip", "hindKneeR"], ["underbelly", "hip"],
  // Tail
  ["hip", "tailBase"], ["tailBase", "tailMid"], ["tailMid", "tailTip"], ["tailTip", "hindHockL"]
];

const nodeMap = new Map(nodes.map(n => [n.id, n]));

export function PremiumSplash() {
  const [visible, setVisible] = useState(true);

  useGSAP(() => {
    // Timeline de la animación de intro
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
      }
    });

    // 1. Animación del Potro de Grafo (SVG)
    tl.fromTo(
      ".graph-link",
      { strokeDasharray: 80, strokeDashoffset: 80, opacity: 0 },
      { strokeDashoffset: 0, opacity: 0.8, duration: 1.5, stagger: 0.02, ease: "power2.out" }
    );

    tl.fromTo(
      ".graph-node",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.01, ease: "back.out(2.2)" },
      "-=1.2"
    );

    // 2. Animación de los textos premium
    tl.fromTo(
      ".splash-title",
      { y: 30, opacity: 0, letterSpacing: "-0.05em" },
      { y: 0, opacity: 1, letterSpacing: "0.08em", duration: 1.0, ease: "power3.out" },
      "-=0.8"
    );

    tl.fromTo(
      ".splash-subtitle",
      { y: 15, opacity: 0 },
      { y: 0, opacity: 0.6, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );

    tl.fromTo(
      ".splash-glow",
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 0.4, duration: 1.5, ease: "sine.out" },
      "-=1.8"
    );

    // 3. Desvanecimiento de salida elegante
    tl.to(
      ".premium-splash",
      {
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)",
        duration: 0.7,
        ease: "power2.inOut",
        delay: 0.5
      }
    );
  }, []);

  if (!visible) return null;

  return (
    <div className="premium-splash" role="presentation">
      <div className="splash-glow" />
      <div className="splash-content">
        <div className="potro-svg-container">
          <svg
            viewBox="50 30 280 270"
            className="potro-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Sombras luminosas */}
            <defs>
              <linearGradient id="gold-teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--teal)" />
                <stop offset="50%" stopColor="var(--gold)" />
                <stop offset="100%" stopColor="var(--teal)" />
              </linearGradient>
              <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Dibujar Relaciones (Líneas) */}
            <g className="links-group">
              {connections.map(([fromId, toId], idx) => {
                const fromNode = nodeMap.get(fromId);
                const toNode = nodeMap.get(toId);
                if (!fromNode || !toNode) return null;
                return (
                  <line
                    key={`link-${idx}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    className="graph-link"
                  />
                );
              })}
            </g>

            {/* Dibujar Nodos (Círculos) */}
            <g className="nodes-group">
              {nodes.map((node) => {
                const isKeyNode =
                  node.id === "nose" ||
                  node.id === "hip" ||
                  node.id === "frontShoulder" ||
                  node.id === "earTip";
                return (
                  <circle
                    key={`node-${node.id}`}
                    cx={node.x}
                    cy={node.y}
                    r={isKeyNode ? 4.5 : 2.5}
                    className={`graph-node ${isKeyNode ? "key-node" : ""}`}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        <h1 className="splash-title">JEROBOOK</h1>
        <p className="splash-subtitle">RED SOCIAL ORIENTADA A GRAFOS</p>
      </div>
    </div>
  );
}
