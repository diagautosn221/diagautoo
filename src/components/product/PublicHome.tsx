"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type PublicHomeProps = {
  site: {
    pages: Array<{
      slug?: string;
      title?: string;
      description?: string;
      status?: string;
    }>;
    services: Array<{
      id?: string;
      title?: string;
      description?: string;
      priceLabel?: string;
      status?: string;
    }>;
    proof: {
      clients: number;
      vehicles: number;
      connectedDevices: number;
    };
  };
};

const productSteps = [
  ["Reception", "Le garage cree le dossier, les photos, les documents et le premier diagnostic."],
  ["Capteur", "Le boitier remonte les signaux utiles : batterie, DTC, kilometrage, temperature."],
  ["Client", "Le proprietaire suit son vehicule, valide les devis et gere ses documents."],
  ["Atelier", "L'equipe voit les urgences, assigne les baies et garde une trace de chaque action."],
];

const lottiePulse = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 220,
  h: 220,
  nm: "DiagAutoSN IoT pulse",
  ddd: 0,
  assets: [],
  layers: [0, 1, 2].map((index) => ({
    ddd: 0,
    ind: index + 1,
    ty: 4,
    nm: `pulse-${index}`,
    sr: 1,
    ks: {
      o: { a: 1, k: [{ t: index * 10, s: [72] }, { t: 68 + index * 8, s: [0] }] },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [110, 110, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ t: index * 10, s: [40, 40, 100] }, { t: 68 + index * 8, s: [116, 116, 100] }] },
    },
    shapes: [
      {
        ty: "el",
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [90, 90] },
      },
      {
        ty: "st",
        c: { a: 0, k: [0.88, 0.05, 0.04, 1] },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 3 },
      },
    ],
    ip: 0,
    op: 90,
    st: 0,
    bm: 0,
  })),
};

function SignalLottie() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animation: { destroy: () => void } | null = null;
    let mounted = true;

    import("lottie-web").then((lottie) => {
      if (!mounted || !containerRef.current) return;
      animation = lottie.default.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: lottiePulse,
      });
    });

    return () => {
      mounted = false;
      animation?.destroy();
    };
  }, []);

  return <div ref={containerRef} className="pointer-events-none absolute inset-auto right-5 top-5 h-32 w-32 opacity-80" />;
}

function VehicleTheatre() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup = () => {};

    import("three").then((three) => {
      if (disposed) return;
      const activeCanvas = canvas;
      const renderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: true });
      const scene = new three.Scene();
      const camera = new three.PerspectiveCamera(38, 1, 0.1, 100);
      const group = new three.Group();
      const pointer = { active: false, x: 0 };

      camera.position.set(0, 1.3, 7);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const red = new three.Color("#e01814");
      const black = new three.Color("#111111");
      const white = new three.Color("#f7f7f5");
      const glass = new three.Color("#1d1d1f");

      scene.add(new three.AmbientLight(0xffffff, 2.4));
      const pointLight = new three.PointLight(red, 7, 9);
      pointLight.position.set(0, 2.4, 2.8);
      scene.add(pointLight);

      const body = new three.Mesh(
        new three.BoxGeometry(3.9, 0.58, 1.36, 8, 1, 1),
        new three.MeshStandardMaterial({ color: white, metalness: 0.28, roughness: 0.26 })
      );
      body.position.y = 0.08;
      group.add(body);

      const cabin = new three.Mesh(
        new three.BoxGeometry(1.72, 0.64, 1.14, 4, 1, 1),
        new three.MeshStandardMaterial({ color: glass, metalness: 0.2, roughness: 0.18 })
      );
      cabin.position.set(0.18, 0.58, 0);
      group.add(cabin);

      [-1.35, 1.35].forEach((x) => {
        [-0.62, 0.62].forEach((z) => {
          const wheel = new three.Mesh(
            new three.CylinderGeometry(0.34, 0.34, 0.22, 36),
            new three.MeshStandardMaterial({ color: black, roughness: 0.44 })
          );
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, -0.27, z);
          group.add(wheel);
        });
      });

      const beaconMaterial = new three.MeshStandardMaterial({
        color: red,
        emissive: red,
        emissiveIntensity: 1.8,
        roughness: 0.2,
      });
      const beaconPositions: Array<[number, number, number]> = [
        [-0.95, 0.38, 0.76],
        [0.82, 0.72, 0.68],
        [1.52, 0.14, -0.76],
      ];
      beaconPositions.forEach(([x, y, z]) => {
        const beacon = new three.Mesh(new three.SphereGeometry(0.08, 24, 24), beaconMaterial);
        beacon.position.set(x, y, z);
        group.add(beacon);
      });

      scene.add(group);

      function resize() {
        const rect = activeCanvas.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / Math.max(rect.height, 1);
        camera.updateProjectionMatrix();
      }

      function onPointerDown(event: PointerEvent) {
        pointer.active = true;
        pointer.x = event.clientX;
        activeCanvas.setPointerCapture(event.pointerId);
      }

      function onPointerMove(event: PointerEvent) {
        if (!pointer.active) return;
        const delta = event.clientX - pointer.x;
        pointer.x = event.clientX;
        group.rotation.y += delta * 0.012;
      }

      function onPointerUp(event: PointerEvent) {
        pointer.active = false;
        if (activeCanvas.hasPointerCapture(event.pointerId)) activeCanvas.releasePointerCapture(event.pointerId);
      }

      function onScroll() {
        const progress = Math.min(window.scrollY / 900, 1);
        pointLight.intensity = 5.2 + progress * 8.5;
        if (glowRef.current) glowRef.current.style.opacity = String(0.22 + progress * 0.38);
      }

      function animate() {
        if (disposed) return;
        group.rotation.y += pointer.active ? 0 : 0.004;
        group.rotation.x = -0.05 + Math.sin(performance.now() / 1400) * 0.015;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }

      resize();
      setLoaded(true);
      window.addEventListener("resize", resize);
      window.addEventListener("scroll", onScroll, { passive: true });
      activeCanvas.addEventListener("pointerdown", onPointerDown);
      activeCanvas.addEventListener("pointermove", onPointerMove);
      activeCanvas.addEventListener("pointerup", onPointerUp);
      animate();

      cleanup = () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        activeCanvas.removeEventListener("pointerdown", onPointerDown);
        activeCanvas.removeEventListener("pointermove", onPointerMove);
        activeCanvas.removeEventListener("pointerup", onPointerUp);
        renderer.dispose();
        scene.traverse((object) => {
          if (object instanceof three.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-[34px] border border-[var(--color-border)] bg-white shadow-[0_36px_120px_color-mix(in_srgb,var(--color-fg)_10%,transparent)] md:min-h-[570px]">
      <div ref={glowRef} className="pointer-events-none absolute inset-10 rounded-full bg-[var(--color-accent)] opacity-25 blur-3xl transition-opacity duration-300" />
      <SignalLottie />
      <canvas ref={canvasRef} className="relative z-10 h-[430px] w-full cursor-grab touch-none active:cursor-grabbing md:h-[570px]" aria-label="Vehicule DiagAutoSN rotatif 3D" />
      <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between gap-3 rounded-[18px] border border-[var(--color-border)] bg-white/80 p-3 backdrop-blur">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">interaction</p>
          <p className="mt-1 text-sm font-black">Tournez le vehicule</p>
        </div>
        <span className="rounded-full bg-[var(--color-accent)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
          {loaded ? "webgl live" : "chargement"}
        </span>
      </div>
    </div>
  );
}

export function PublicHome({ site }: PublicHomeProps) {
  const homepage = site.pages.find((page) => page.slug === "accueil");
  const pinSectionRef = useRef<HTMLElement | null>(null);
  const pinCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cleanup = () => {};
    let mounted = true;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      if (!mounted || !pinSectionRef.current || !pinCardRef.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const trigger = ScrollTrigger.create({
        trigger: pinSectionRef.current,
        start: "top 12%",
        end: "bottom 85%",
        pin: pinCardRef.current,
        pinSpacing: false,
      });

      const tween = gsap.fromTo(
        ".service-snap-card",
        { y: 44, opacity: 0.72 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pinSectionRef.current,
            start: "top 65%",
            end: "bottom 65%",
            scrub: 0.8,
          },
        }
      );

      cleanup = () => {
        tween.kill();
        trigger.kill();
      };
    });

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return (
    <main className="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-fg)]">
      <section className="container-tight grid min-h-[100svh] gap-8 pb-12 pt-28 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div className="min-w-0">
          <h1 className="max-w-[11ch] text-balance font-display text-6xl font-black leading-[0.86] tracking-[-0.07em] md:text-8xl">
            Le garage qui parle enfin a la voiture.
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-[var(--color-fg-muted)] md:text-xl">
            {homepage?.description ||
              "Diagnostic, entretien, documents, devis, paiements et alertes IoT dans une experience claire pour le garage et ses clients."}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-black text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
            >
              Ouvrir mon espace
            </Link>
            <Link
              href="/atelier"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-[var(--color-fg)] px-6 text-sm font-black text-[var(--color-fg)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:translate-y-px"
            >
              Voir le cockpit
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-border)]">
            {[
              ["clients", site.proof.clients],
              ["vehicules", site.proof.vehicles],
              ["capteurs", site.proof.connectedDevices],
            ].map(([label, value]) => (
              <div key={label} className="bg-white p-4">
                <div className="tabular font-mono text-2xl font-black">{value}</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <VehicleTheatre />
      </section>

      <section ref={pinSectionRef} className="container-tight grid gap-8 py-20 lg:grid-cols-[0.88fr_1.12fr]">
        <div ref={pinCardRef} className="h-fit rounded-[30px] border border-[var(--color-fg)] bg-[var(--color-fg)] p-6 text-white md:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-soft)]">
            experience produit
          </p>
          <h2 className="mt-4 max-w-[10ch] text-4xl font-black leading-[0.92] tracking-[-0.055em] md:text-6xl">
            Le capteur ne sert a rien si l'humain ne comprend pas.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/70">
            La logique DiagAutoSN transforme les signaux techniques en decisions : rouler, surveiller, reserver un atelier, valider un devis.
          </p>
        </div>

        <div className="grid gap-3">
          {productSteps.map(([title, text], index) => (
            <article key={title} className="service-snap-card rounded-[26px] border border-[var(--color-border)] bg-white p-6 shadow-[0_24px_90px_color-mix(in_srgb,var(--color-fg)_8%,transparent)]">
              <div className="font-mono text-xs text-[var(--color-accent)]">0{index + 1}</div>
              <h3 className="mt-5 text-3xl font-black tracking-[-0.045em]">{title}</h3>
              <p className="mt-3 max-w-xl text-base leading-7 text-[var(--color-fg-muted)]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="container-tight pb-20">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.055em] md:text-6xl">
              Les services defilent. Le client choisit sans friction.
            </h2>
          </div>
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-border-strong)] px-5 text-sm font-black hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Gerer le CMS
          </Link>
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {site.services.map((service, index) => (
            <article
              key={service.id}
              className="service-snap-card min-h-[320px] min-w-[min(84vw,390px)] snap-center rounded-[30px] border border-[var(--color-border)] bg-white p-6 shadow-[0_24px_90px_color-mix(in_srgb,var(--color-fg)_8%,transparent)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-[var(--color-accent)]">0{index + 1}</span>
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                  {service.priceLabel}
                </span>
              </div>
              <h3 className="mt-12 text-3xl font-black tracking-[-0.045em]">{service.title}</h3>
              <p className="mt-4 text-base leading-7 text-[var(--color-fg-muted)]">{service.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
