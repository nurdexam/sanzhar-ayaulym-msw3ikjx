"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CalendarBlank,
  Check,
  Clock,
  Heart,
  MapPin,
  MusicNotes,
  Pause,
  Sparkle,
  StarFour,
  UsersThree,
} from "@phosphor-icons/react";
import type { InvitationData } from "@/types/invitation";
import Image from "next/image";

interface PremiumInvitationProps {
  data: InvitationData;
}

export default function PremiumInvitation({
  data,
}: PremiumInvitationProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [attending, setAttending] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "25%"]
  );

  const heroScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.12]
  );

  useEffect(() => {
    const target = new Date(data.dateTime);

    const updateTimer = () => {
      const difference = target.getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setTimeLeft({
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (difference / (1000 * 60)) % 60
        ),
        seconds: Math.floor(
          (difference / 1000) % 60
        ),
      });
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [data.dateTime]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Аты-жөніңізді енгізіңіз");
      return;
    }

    if (attending === null) {
      setMessage("Жауабыңызды таңдаңыз");
      return;
    }

    if (!data.clientEmail) {
      setMessage("Email табылмады");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientEmail: data.clientEmail,
          name: name.trim(),
          guests,
          attending,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Қате орын алды"
        );
      }

      setMessage(
        "Рақмет! Жауабыңыз қабылданды ❤️"
      );

      setName("");
      setGuests(1);
      setAttending(null);
    } catch (error) {
      console.error("RSVP error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Жауапты жіберу мүмкін болмады"
      );
    } finally {
      setLoading(false);
    }
  }

  const toggleMusic = () => {
    const audio = document.getElementById(
      "premium-music"
    ) as HTMLAudioElement | null;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        console.log(
          "Музыканы ойнату мүмкін болмады."
        );
      });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f0e4] text-[#2c2418]">
      {/* MUSIC */}

      <audio
        id="premium-music"
        loop
        preload="metadata"
      >
        <source
          src="/music/toy.mp3"
          type="audio/mpeg"
        />
      </audio>

      <motion.button
        type="button"
        onClick={toggleMusic}
        aria-label="Музыканы қосу немесе өшіру"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed right-5 top-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#c6a45b]/50 bg-[#241c12]/80 text-[#e8ca82] shadow-2xl backdrop-blur-xl"
      >
        {isPlaying ? (
          <Pause size={19} weight="bold" />
        ) : (
          <MusicNotes size={19} weight="bold" />
        )}

        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-[#c6a45b]/40 animate-ping" />
        )}
      </motion.button>

      {/* HERO */}

      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#19140e]"
      >
        <motion.div
          style={{
            y: heroImageY,
            scale: heroScale,
          }}
          className="absolute inset-0"
        >
          <Image
            src={data.coverImage}
            alt={`${data.groom} мен ${data.bride}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80" />

        {/* Қазақы ою */}

        <div className="absolute inset-5 border border-[#d8b86a]/40 sm:inset-8" />

        <div className="absolute inset-8 border border-white/10 sm:inset-12" />

        <Ornament className="absolute left-8 top-8 h-24 w-24 text-[#d8b86a]/70" />

        <Ornament className="absolute bottom-8 right-8 h-24 w-24 rotate-180 text-[#d8b86a]/70" />

        {/* Hero content */}

        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          className="relative z-20 px-6 text-center text-white"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
            }}
            className="mb-8 flex items-center justify-center gap-4 text-[#e2c578]"
          >
            <span className="h-px w-14 bg-[#d8b86a]/60" />

            <Sparkle
              size={18}
              weight="thin"
            />

            <span className="h-px w-14 bg-[#d8b86a]/60" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-body text-[10px] font-medium uppercase tracking-[0.6em] text-[#e6d4a5]"
          >
            Ақ бата • Ұлы той • Қуаныш
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.7,
              duration: 1,
            }}
            className="mt-8 font-wedding text-6xl leading-[0.9] text-white sm:text-8xl md:text-[9rem]"
          >
            <span className="block">
              {data.groom}
            </span>

            <span className="my-3 block font-serif text-3xl font-light italic text-[#e2c578] sm:text-5xl">
              &
            </span>

            <span className="block">
              {data.bride}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              delay: 1.2,
              duration: 0.8,
            }}
            className="mx-auto mt-10 flex max-w-md items-center justify-center gap-5"
          >
            <span className="h-px flex-1 bg-white/30" />

            <p className="font-body text-xs font-medium uppercase tracking-[0.35em] text-white">
              {data.date}
            </p>

            <span className="h-px flex-1 bg-white/30" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-5 font-serif text-sm italic text-white/70"
          >
            Өміріміздің ең әдемі сәті
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.8,
          }}
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-white/70"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-body text-[9px] uppercase tracking-[0.35em]">
              Төмен жылжытыңыз
            </span>

            <ArrowDown
              size={20}
              weight="thin"
              className="animate-bounce"
            />
          </div>
        </motion.div>
      </section>

      {/* INTRO */}

      <section className="relative overflow-hidden px-6 py-32 sm:py-44">
        <DecorativePattern />

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
          transition={{
            duration: 1,
          }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <GoldSymbol />

          <p className="mt-8 font-body text-[10px] uppercase tracking-[0.5em] text-[#9b7a3d]">
            Құрметті ағайын-туыс,
          </p>

          <h2 className="mt-7 font-serif text-4xl leading-tight sm:text-6xl">
            Сіздерді өміріміздегі
            <br />
            ең бақытты күнге
            <br />
            шақырамыз
          </h2>

          <p className="mx-auto mt-9 max-w-xl font-body text-sm leading-8 text-[#716653]">
            Екі жүрек бір арнада тоғысып,
            жаңа өмірге қадам басқан
            қуанышты күнімізде сіздердің
            ақ тілектеріңіз бен ақ баталарыңыз
            біз үшін ерекше қымбат.
          </p>

          <div className="mt-12 font-wedding text-4xl text-[#a47d32]">
            {data.groom} & {data.bride}
          </div>
        </motion.div>
      </section>

      {/* DATE / COUNTDOWN */}

      <section className="relative overflow-hidden bg-[#211a11] px-6 py-28 text-white sm:py-36">
        <div className="absolute inset-0 opacity-[0.04]">
          <PatternSvg />
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.9,
          }}
          className="relative mx-auto max-w-5xl text-center"
        >
          <GoldSymbol light />

          <p className="mt-8 font-body text-[10px] uppercase tracking-[0.5em] text-[#c6a45b]">
            Үлкен күнге дейін
          </p>

          <h2 className="mt-5 font-serif text-4xl sm:text-6xl">
            Қуанышты күнге
            <br />
            санаулы сәт
          </h2>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            <PremiumCountdown
              value={timeLeft.days}
              label="КҮН"
            />

            <PremiumCountdown
              value={timeLeft.hours}
              label="САҒАТ"
            />

            <PremiumCountdown
              value={timeLeft.minutes}
              label="МИНУТ"
            />

            <PremiumCountdown
              value={timeLeft.seconds}
              label="СЕКУНД"
            />
          </div>

          <p className="mt-10 font-serif text-sm italic text-white/40">
            {data.date} • {data.time}
          </p>
        </motion.div>
      </section>

      {/* LOVE STORY */}

      <section className="relative px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Біздің тарихымыз"
            title="Екі жүрек — бір тағдыр"
          />

          <div className="mt-20 grid items-center gap-14 md:grid-cols-2">
            <motion.div
              initial={{
                opacity: 0,
                x: -50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.9,
              }}
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"
            >
              {data.gallery[0] && (
                <Image
                  src={data.gallery[0]}
                  alt="Біздің тарихымыз"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              <div className="absolute bottom-7 left-7 text-white">
                <p className="font-body text-[9px] uppercase tracking-[0.3em]">
                  Бірге
                </p>

                <p className="mt-2 font-wedding text-4xl">
                  мәңгілікке
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.9,
              }}
            >
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#a47d32]">
                Махаббат
              </p>

              <h3 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
                Бір кездейсоқ
                <br />
                кездесу...
                <br />
                мәңгілікке айналды.
              </h3>

              <p className="mt-7 font-body text-sm leading-8 text-[#756c5d]">
                Кейбір кездесулер жай ғана
                кездесу емес. Олар адамның
                өмірін өзгертіп, жүрегіне жаңа
                мағына сыйлайды.
              </p>

              <div className="mt-10 h-px w-20 bg-[#c6a45b]" />

              <p className="mt-8 font-serif text-lg italic text-[#5d5344]">
                «Бақыт — бірге бола білу»
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EVENT INFO */}

      <section className="bg-[#eee6d8] px-6 py-32 sm:py-40">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Той туралы"
            title="Маңызды ақпарат"
          />

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            <PremiumInfoCard
              icon={
                <CalendarBlank
                  size={28}
                  weight="thin"
                />
              }
              title="Күні"
              value={data.date}
              number="01"
            />

            <PremiumInfoCard
              icon={
                <Clock
                  size={28}
                  weight="thin"
                />
              }
              title="Басталуы"
              value={data.time}
              number="02"
            />

            <PremiumInfoCard
              icon={
                <MapPin
                  size={28}
                  weight="thin"
                />
              }
              title="Мекенжай"
              value={data.venue}
              description={data.address}
              number="03"
            />
          </div>
        </div>
      </section>

      {/* KAZAKH BLESSING */}

      <section className="relative isolate overflow-hidden bg-[#211a11] px-6 py-32 text-white sm:py-40">
  {/* Animated Kazakh pattern */}
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 0.07 }}
    viewport={{ once: true }}
    transition={{ duration: 2 }}
    className="pointer-events-none absolute inset-0"
  >
    <motion.div
      animate={{
        x: [0, 20, 0],
        y: [0, -15, 0],
        rotate: [0, 1.5, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="h-[120%] w-[120%] -translate-x-[10%] -translate-y-[10%]"
    >
      <PatternSvg />
    </motion.div>
  </motion.div>

  {/* Soft golden glow */}
  <motion.div
    animate={{
      opacity: [0.12, 0.22, 0.12],
      scale: [1, 1.15, 1],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c6a45b]/10 blur-[120px]"
  />

  {/* Floating golden particles */}
  <FloatingParticle
    className="left-[12%] top-[20%]"
    delay={0}
  />

  <FloatingParticle
    className="left-[82%] top-[25%]"
    delay={1.5}
  />

  <FloatingParticle
    className="left-[20%] top-[70%]"
    delay={3}
  />

  <FloatingParticle
    className="left-[78%] top-[72%]"
    delay={4.5}
  />

  <FloatingParticle
    className="left-[50%] top-[15%]"
    delay={2}
  />

  {/* Decorative corners */}
  <motion.div
    initial={{
      opacity: 0,
      x: -40,
      y: -40,
    }}
    whileInView={{
      opacity: 0.6,
      x: 0,
      y: 0,
    }}
    viewport={{ once: true }}
    transition={{
      duration: 1.5,
      ease: "easeOut",
    }}
    className="pointer-events-none absolute left-0 top-0 h-40 w-40 text-[#d7b766]"
  >
    <Ornament className="h-full w-full" />
  </motion.div>

  <motion.div
    initial={{
      opacity: 0,
      x: 40,
      y: 40,
    }}
    whileInView={{
      opacity: 0.6,
      x: 0,
      y: 0,
    }}
    viewport={{ once: true }}
    transition={{
      duration: 1.5,
      ease: "easeOut",
    }}
    className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rotate-180 text-[#d7b766]"
  >
    <Ornament className="h-full w-full" />
  </motion.div>

  {/* Main content */}
  <div className="relative mx-auto max-w-3xl text-center">
    {/* Symbol */}
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5,
        rotate: -30,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      viewport={{
        once: true,
        margin: "-100px",
      }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative mx-auto flex h-24 w-24 items-center justify-center"
    >
      {/* outer rotating ring */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full border border-dashed border-[#c6a45b]/40"
      />

      {/* inner ring */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-3 rounded-full border border-[#d7b766]/30"
      />

      {/* glow */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-[#d7b766]/20 blur-xl"
      />

      <StarFour
        size={34}
        weight="thin"
        className="relative z-10 text-[#d7b766]"
      />
    </motion.div>

    {/* Eyebrow */}
    <motion.p
      initial={{
        opacity: 0,
        y: 20,
        letterSpacing: "0.2em",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        letterSpacing: "0.5em",
      }}
      viewport={{ once: true }}
      transition={{
        delay: 0.35,
        duration: 1,
      }}
      className="mt-9 font-body text-[10px] uppercase text-[#d7b766]"
    >
      Ақ бата
    </motion.p>

    {/* Decorative line */}
    <motion.div
      initial={{
        scaleX: 0,
        opacity: 0,
      }}
      whileInView={{
        scaleX: 1,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{
        delay: 0.6,
        duration: 0.9,
      }}
      className="mx-auto mt-7 flex items-center justify-center gap-3"
    >
      <span className="h-px w-10 bg-[#c6a45b]/40" />

      <span className="h-1 w-1 rotate-45 bg-[#d7b766]" />

      <span className="h-px w-10 bg-[#c6a45b]/40" />
    </motion.div>

    {/* Quote */}
    <motion.blockquote
      initial={{
        opacity: 0,
        y: 35,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        delay: 0.5,
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mt-10 font-serif text-3xl leading-[1.7] text-[#f5ead4] sm:text-5xl sm:leading-[1.6]"
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        Ақ мол болсын,
      </motion.span>

      <br />

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
      >
        дастархан берекелі болсын.
      </motion.span>

      <br />

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        Екі жасқа бақыт пен
      </motion.span>

      <br />

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4 }}
        className="text-[#e0c477]"
      >
        баянды ғұмыр берсін!
      </motion.span>
    </motion.blockquote>

    {/* Bottom ornament */}
    <motion.div
      initial={{
        opacity: 0,
        scaleX: 0,
      }}
      whileInView={{
        opacity: 1,
        scaleX: 1,
      }}
      viewport={{ once: true }}
      transition={{
        delay: 1.6,
        duration: 0.8,
      }}
      className="mx-auto mt-12 flex items-center justify-center gap-4"
    >
      <span className="h-px w-16 bg-[#c6a45b]/50" />

      <div className="h-2 w-2 rotate-45 border border-[#d7b766]" />

      <span className="h-px w-16 bg-[#c6a45b]/50" />
    </motion.div>

    {/* Signature */}
    <motion.p
      initial={{
        opacity: 0,
        y: 15,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{
        delay: 1.8,
        duration: 0.8,
      }}
      className="mt-7 font-body text-xs uppercase tracking-[0.3em] text-white/40"
    >
      Ақ тілегімізбен
    </motion.p>
  </div>
</section>

      {/* PROGRAM */}

      <section className="px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Той бағдарламасы"
            title="Кешіміздің көрінісі"
          />

          <div className="relative mt-20">
            <div className="absolute bottom-0 left-6 top-0 w-px bg-[#d8ccb8] md:left-1/2" />

            {data.events.map((event, index) => (
              <motion.div
                key={`${event.time}-${index}`}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-60px",
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                }}
                className={`relative mb-12 flex ${
                  index % 2 === 0
                    ? "md:justify-start"
                    : "md:justify-end"
                }`}
              >
                <div className="w-full pl-16 md:w-[46%] md:pl-0">
                  <div className="relative rounded-3xl border border-[#ded3c2] bg-white/60 p-7 shadow-sm">
                    <span className="absolute -left-[46px] top-8 flex h-10 w-10 items-center justify-center rounded-full border border-[#c6a45b] bg-[#f6f0e4] font-serif text-xs text-[#9b742e] md:hidden">
                      {index + 1}
                    </span>

                    <p className="font-serif text-2xl">
                      {event.title}
                    </p>

                    <p className="mt-3 font-body text-[10px] uppercase tracking-[0.25em] text-[#9b7a3d]">
                      {event.time}
                    </p>

                    <div className="mt-5 h-px w-10 bg-[#c6a45b]" />
                  </div>
                </div>

                <div className="absolute left-[calc(50%-20px)] top-7 hidden h-10 w-10 items-center justify-center rounded-full border border-[#c6a45b] bg-[#f6f0e4] font-serif text-xs text-[#9b742e] md:flex">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}

      <section className="bg-[#211a11] px-6 py-32 text-white sm:py-44">
        <SectionHeading
          eyebrow="Біздің естеліктер"
          title="Бақытты сәттер"
          dark
        />

        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {data.gallery.map((image, index) => {
            const featured =
              index === 0 ||
              index === 3 ||
              index === 6;

            return (
              <motion.div
                key={`${image}-${index}`}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.06,
                }}
                className={`group relative overflow-hidden rounded-xl ${
                  featured
                    ? "col-span-2 aspect-[16/10]"
                    : "aspect-square"
                }`}
              >
                <Image
                  src={image}
                  alt="Естелік сурет"
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition duration-1000 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/20" />

                <div className="absolute inset-4 border border-white/0 transition duration-500 group-hover:border-white/30" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAMILY */}

      <section className="relative px-6 py-32 sm:py-44">
        <DecorativePattern />

        <div className="relative mx-auto max-w-5xl text-center">
          <SectionHeading
            eyebrow="Қуанышымызды бөлісетін"
            title="Ардақты жандар"
          />

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            <FamilyCard
              icon={<UsersThree size={28} weight="thin" />}
              title="Құдалар"
              text="Екі әулеттің ақ тілегі мен қуанышы — біздің ең үлкен байлығымыз."
            />

            <FamilyCard
              icon={<Heart size={28} weight="thin" />}
              title="Ағайын-туыс"
              text="Ақ дастарханымыздың төрінен сіздерге әрдайым орын бар."
            />
          </div>
        </div>
      </section>

      {/* LOCATION */}

      <section className="bg-[#eee6d8] px-6 py-32 sm:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <MapPin
            size={34}
            weight="thin"
            className="mx-auto text-[#9b742e]"
          />

          <p className="mt-8 font-body text-[10px] uppercase tracking-[0.5em] text-[#9b7a3d]">
            Той өтетін мекен
          </p>

          <h2 className="mt-6 font-serif text-4xl sm:text-6xl">
            {data.venue}
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-body text-sm leading-8 text-[#756c5d]">
            {data.address}
          </p>

          <motion.a
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            href={`https://2gis.kz/search/${encodeURIComponent(
              `${data.venue}, ${data.address}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#302719] px-8 py-4 font-body text-[10px] uppercase tracking-[0.25em] transition hover:bg-[#302719] hover:text-white"
          >
            <MapPin size={16} />
            Картаны ашу
            <ArrowRight size={15} />
          </motion.a>
        </div>
      </section>

      {/* RSVP */}

      <section className="px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-xl text-center">
          <GoldSymbol />

          <p className="mt-8 font-body text-[10px] uppercase tracking-[0.5em] text-[#9b7a3d]">
            Қатысуыңызды растаңыз
          </p>

          <h2 className="mt-6 font-serif text-4xl sm:text-6xl">
            Тойға келесіз бе?
          </h2>

          <p className="mt-7 font-body text-sm leading-8 text-[#756c5d]">
            Келетініңізді алдын ала хабарлауыңызды
            сұраймыз.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-4 text-left"
          >
            <PremiumInput
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Аты-жөніңіз"
            />

            <PremiumInput
              type="number"
              min={1}
              value={guests}
              onChange={(e) =>
                setGuests(Number(e.target.value))
              }
              placeholder="Қонақтар саны"
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setAttending(true)
                }
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-5 font-body text-[10px] uppercase tracking-[0.15em] transition ${
                  attending === true
                    ? "border-[#302719] bg-[#302719] text-white"
                    : "border-[#d4c8b5] bg-white/40 hover:bg-[#302719] hover:text-white"
                }`}
              >
                {attending === true && (
                  <Check size={15} />
                )}
                Иә, келемін
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setAttending(false)
                }
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-5 font-body text-[10px] uppercase tracking-[0.15em] transition ${
                  attending === false
                    ? "border-[#302719] bg-[#302719] text-white"
                    : "border-[#d4c8b5] bg-white/40 hover:bg-[#302719] hover:text-white"
                }`}
              >
                {attending === false && (
                  <Check size={15} />
                )}
                Келе алмаймын
              </motion.button>
            </div>

            {message && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="py-3 text-center font-body text-sm text-[#756c5d]"
              >
                {message}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="w-full rounded-2xl bg-[#302719] px-6 py-5 font-body text-[10px] uppercase tracking-[0.3em] text-white transition hover:bg-[#493c29] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Жіберілуде..."
                : "Жауапты жіберу"}
            </motion.button>
          </form>
        </div>
      </section>

      {/* FINAL */}

      <section className="relative overflow-hidden bg-[#211a11] px-6 py-36 text-center text-white sm:py-48">
        <div className="absolute inset-0 opacity-[0.05]">
          <PatternSvg />
        </div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.2,
          }}
          className="relative mx-auto max-w-3xl"
        >
          <GoldSymbol light />

          <p className="mt-9 font-body text-[10px] uppercase tracking-[0.5em] text-[#d8b86a]">
            Тойымызда жүздескенше!
          </p>

          <h2 className="mt-8 font-wedding text-5xl text-[#f3dfaa] sm:text-7xl">
            {data.groom}
          </h2>

          <div className="my-4 font-serif text-3xl italic text-[#c6a45b]">
            &
          </div>

          <h2 className="font-wedding text-5xl text-[#f3dfaa] sm:text-7xl">
            {data.bride}
          </h2>

          <div className="mx-auto my-10 h-px w-16 bg-[#c6a45b]" />

          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-white/40">
            {data.date}
          </p>
        </motion.div>
      </section>
    </main>
  );
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function GoldSymbol({
  light = false,
}: {
  light?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${
        light
          ? "border-[#c6a45b]/50"
          : "border-[#c6a45b]/60"
      }`}
    >
      <Heart
        size={25}
        weight="thin"
        className={
          light
            ? "text-[#d8b86a]"
            : "text-[#9b742e]"
        }
      />
    </div>
  );
}

function PremiumCountdown({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="rounded-2xl border border-[#c6a45b]/20 bg-white/[0.035] px-4 py-7 backdrop-blur-md sm:px-8 sm:py-9"
    >
      <div className="font-serif text-4xl text-[#e3c779] sm:text-6xl">
        {String(value).padStart(2, "0")}
      </div>

      <div className="mt-3 font-body text-[8px] tracking-[0.3em] text-white/40 sm:text-[10px]">
        {label}
      </div>
    </motion.div>
  );
}

function PremiumInfoCard({
  icon,
  title,
  value,
  description,
  number,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
  number: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -8,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
      }}
      className="relative overflow-hidden rounded-[2rem] border border-[#d9cebd] bg-white/50 p-9 text-center shadow-sm"
    >
      <span className="absolute right-7 top-6 font-serif text-xs text-[#b69a63]">
        {number}
      </span>

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#c6a45b]/60 text-[#9b742e]">
        {icon}
      </div>

      <p className="mt-7 font-body text-[9px] uppercase tracking-[0.35em] text-[#8f7650]">
        {title}
      </p>

      <p className="mt-4 font-serif text-xl">
        {value}
      </p>

      {description && (
        <p className="mt-2 font-body text-xs leading-6 text-[#817563]">
          {description}
        </p>
      )}

      <div className="mx-auto mt-6 h-px w-8 bg-[#c6a45b]" />
    </motion.div>
  );
}

function FamilyCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -5,
      }}
      viewport={{
        once: true,
      }}
      className="rounded-[2rem] border border-[#ddd1bd] bg-white/50 p-10 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#c6a45b]/60 text-[#9b742e]">
        {icon}
      </div>

      <h3 className="mt-7 font-serif text-2xl">
        {title}
      </h3>

      <p className="mx-auto mt-5 max-w-sm font-body text-sm leading-7 text-[#756c5d]">
        {text}
      </p>
    </motion.div>
  );
}

function PremiumInput({
  type = "text",
  value,
  onChange,
  placeholder,
  min,
}: {
  type?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder: string;
  min?: number | string;
}) {
  return (
    <div className="rounded-2xl border border-[#d7cbb8] bg-white/50 p-1 transition focus-within:border-[#a47d32]">
      <input
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent px-5 py-4 font-body text-sm outline-none placeholder:text-[#998e7d]"
      />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="mb-6 flex items-center justify-center gap-3">
        <span
          className={`h-px w-10 ${
            dark
              ? "bg-[#c6a45b]/40"
              : "bg-[#c6a45b]/50"
          }`}
        />

        <Sparkle
          size={15}
          weight="thin"
          className={
            dark
              ? "text-[#d8b86a]"
              : "text-[#9b742e]"
          }
        />

        <span
          className={`h-px w-10 ${
            dark
              ? "bg-[#c6a45b]/40"
              : "bg-[#c6a45b]/50"
          }`}
        />
      </div>

      <p
        className={`font-body text-[10px] uppercase tracking-[0.45em] ${
          dark
            ? "text-[#d8b86a]"
            : "text-[#9b7a3d]"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-5 font-serif text-4xl sm:text-6xl ${
          dark ? "text-white" : "text-[#2c2418]"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

/* ========================================================= */
/* KAZAKH ORNAMENT */
/* ========================================================= */

function Ornament({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 10C30 10 45 25 45 45C45 65 30 80 10 80"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      <path
        d="M90 10C70 10 55 25 55 45C55 65 70 80 90 80"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      <path
        d="M45 45C30 30 25 15 40 10C55 5 65 20 55 35"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      <path
        d="M55 45C70 30 75 15 60 10C45 5 35 20 45 35"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      <circle
        cx="50"
        cy="48"
        r="5"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function FloatingParticle({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -18, 0],
        opacity: [0.2, 0.9, 0.2],
        scale: [0.8, 1.15, 0.8],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`pointer-events-none absolute ${className}`}
    >
      <span className="block h-2.5 w-2.5 rounded-full bg-[#d7b766]/80 shadow-[0_0_18px_rgba(215,183,102,0.8)]" />
    </motion.div>
  );
}

function DecorativePattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.035]">
      <PatternSvg />
    </div>
  );
}

function PatternSvg() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 500"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className="h-full w-full"
    >
      <pattern
        id="kazakh-pattern"
        width="100"
        height="100"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M50 5C65 20 80 35 95 50C80 65 65 80 50 95C35 80 20 65 5 50C20 35 35 20 50 5Z"
          stroke="currentColor"
          strokeWidth="1"
        />

        <path
          d="M50 20C60 30 70 40 80 50C70 60 60 70 50 80C40 70 30 60 20 50C30 40 40 30 50 20Z"
          stroke="currentColor"
          strokeWidth="1"
        />

        <circle
          cx="50"
          cy="50"
          r="8"
          stroke="currentColor"
          strokeWidth="1"
        />
      </pattern>

      <rect
        width="100%"
        height="100%"
        fill="url(#kazakh-pattern)"
      />
    </svg>
  );
}