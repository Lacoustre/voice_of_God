import { motion } from "framer-motion";
import { Heart, BookOpen, Sparkles } from "lucide-react";

export default function CoreBeliefSection() {
  return (
    <section
      id="core-belief"
      className="relative py-20 overflow-hidden bg-church-gradient"
      aria-labelledby="core-belief-heading"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_10%,black,transparent)]">
        <div className="absolute -top-32 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-fuchsia-200/30 blur-3xl" />
      </div>

      <div className="w-full px-0">
        <div className="text-center mb-10">
          <h2 id="core-belief-heading" className="text-3xl md:text-4xl font-semibold tracking-tight text-primary-900">
            Core Belief
          </h2>
          <p className="mt-3 text-sm text-primary-600">
            Christ-centered • Welcoming to all • Anchored in Scripture
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full"
        >
          <div className="relative rounded-3xl bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md p-8 md:p-12">
            {/* Quote mark */}
            <div className="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-gray-200">
              <span aria-hidden className="text-3xl leading-none text-indigo-500">"</span>
            </div>

            <p className="text-lg md:text-xl text-primary-800 leading-relaxed text-center font-medium">
              We are a Christ-centered community committed to loving and welcoming all people. While we embrace everyone
              with compassion and respect, we uphold the Bible as the ultimate authority and guide for life. We believe
              that all people, regardless of background, are on a journey of transformation—turning from worldly desires
              and aligning their lives with God&apos;s will. Together, we walk in <span className="font-semibold text-primary-700">Grace</span>,
              stand in <span className="font-semibold text-primary-700">Truth</span>, and pursue lasting change through the hope found in Jesus Christ.
            </p>

            {/* Pillars */}
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-8">
              <li className="group flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 text-sm text-primary-700 transition-all hover:bg-white cursor-pointer">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                  <Heart className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-primary-900">Grace</p>
                  <p className="text-primary-600">Love that welcomes and restores</p>
                </div>
              </li>
              <li className="group flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 text-sm text-primary-700 transition-all hover:bg-white cursor-pointer">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                  <BookOpen className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-primary-900">Truth</p>
                  <p className="text-primary-600">Scripture as our foundation</p>
                </div>
              </li>
              <li className="group flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 text-sm text-primary-700 transition-all hover:bg-white cursor-pointer">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-primary-900">Transformation</p>
                  <p className="text-primary-600">A lifelong journey with Jesus</p>
                </div>
              </li>
            </ul>

            {/* Scripture reference row */}
            <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
              <span className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1 text-xs font-medium text-white shadow">
                Romans 12:2
              </span>
              <span className="text-xs text-primary-600">Be transformed by the renewing of your mind.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}