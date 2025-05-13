import React, { ReactNode } from "react";
import { ArrowRightIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrainCog, BarChart3, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
        {name}
      </h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

const features = [
  {
    Icon: BrainCog,
    name: "Asisten Cerdas",
    description: "AI Chatbot Tutor yang membantu Anda memahami pasar saham dan investasi dengan bahasa yang mudah dipahami.",
    href: "/",
    cta: "Pelajari lebih lanjut",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-[#e94340]/10 w-40 h-40 rounded-full blur-xl" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3 border-[#e94340]/20 border",
  },
  {
    Icon: BarChart3,
    name: "Data IDX Spesifik",
    description: "Akses data dan alat analisis khusus untuk pasar saham Indonesia yang membantu Anda membuat keputusan investasi yang lebih baik.",
    href: "/",
    cta: "Pelajari lebih lanjut",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-[#009a83]/10 w-40 h-40 rounded-full blur-xl" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 border-[#009a83]/20 border",
  },
  {
    Icon: Wallet,
    name: "Portofolio Virtual",
    description: "Simulasi perdagangan bebas risiko untuk melatih strategi investasi Anda sebelum menggunakan uang sungguhan.",
    href: "/",
    cta: "Pelajari lebih lanjut",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-[#199177]/10 w-40 h-40 rounded-full blur-xl" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4 border-[#199177]/20 border",
  },
  {
    Icon: BarChart3,
    name: "Analisis Teknikal",
    description: "Alat analisis teknikal canggih untuk membantu Anda mengidentifikasi tren dan pola pergerakan harga saham.",
    href: "/",
    cta: "Pelajari lebih lanjut",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-[#e94340]/10 w-40 h-40 rounded-full blur-xl" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2 border-[#e94340]/20 border",
  },
  {
    Icon: BrainCog,
    name: "Rekomendasi Cerdas",
    description: "Dapatkan rekomendasi saham yang dipersonalisasi berdasarkan profil risiko dan tujuan investasi Anda.",
    href: "/",
    cta: "Pelajari lebih lanjut",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-[#009a83]/10 w-40 h-40 rounded-full blur-xl" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4 border-[#009a83]/20 border",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Platform investasi saham modern dengan fitur-fitur canggih untuk membantu Anda memulai perjalanan investasi dengan percaya diri.
          </p>
        </div>
        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

export default FeaturesSection;