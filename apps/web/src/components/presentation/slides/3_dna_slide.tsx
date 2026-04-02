import { motion } from "motion/react";
import {
  InfoPanel,
  SlideBody,
  SlideFrame,
  SlideHeader,
  SlideSubtitle,
  SlideTitle,
} from "../slide";

export function DNASlide() {
  const timelineItems = [
    {
      year: "2006",
      phase: "Khởi đầu",
      title: "Dự án cá nhân",
      detail:
        "Graydon Hoare bắt đầu thử nghiệm một ngôn ngữ hệ thống an toàn hơn.",
      badgeClass: "border-zinc-500/25 bg-zinc-500/10 text-zinc-300",
      dotClass: "bg-zinc-400 shadow-[0_0_0_8px_rgba(161,161,170,0.12)]",
      lineClass: "from-zinc-400/50 to-zinc-400/5",
      yearClass: "text-foreground",
    },
    {
      year: "2009",
      phase: "Bước ngoặt",
      title: "Mozilla tài trợ",
      detail:
        "Rust được đưa vào quỹ đạo nghiêm túc với nguồn lực và tầm nhìn dài hạn.",
      badgeClass: "border-orange-500/25 bg-orange-500/10 text-orange-400",
      dotClass: "bg-orange-500 shadow-[0_0_0_8px_rgba(249,115,22,0.14)]",
      lineClass: "from-orange-500/55 to-orange-500/5",
      yearClass: "text-orange-400",
    },
    {
      year: "2015",
      phase: "Chuẩn mực mới",
      title: "Rust 1.0 phát hành",
      detail:
        "Từ ý tưởng học thuật, Rust trở thành lựa chọn thực chiến cho systems programming.",
      badgeClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
      dotClass:
        "bg-emerald-500 shadow-[0_0_0_8px_rgba(16,185,129,0.14),0_0_24px_rgba(16,185,129,0.35)]",
      lineClass: "from-emerald-500/55 to-emerald-500/5",
      yearClass: "text-emerald-400",
    },
  ];

  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Kỷ nguyên Mozilla & DNA của Rust</SlideTitle>
        <SlideSubtitle>
          Từ một dự án cá nhân (2006) đến chuẩn mực mới (2015)
        </SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <div className="mt-8 flex flex-col items-center gap-14">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/70 bg-linear-to-br from-background via-background to-muted/20 px-8 py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_24%)]" />
            <div className="absolute top-[4.85rem] right-16 left-16 hidden h-px bg-linear-to-r from-zinc-500/15 via-border to-emerald-500/15 md:block" />

            <div className="relative grid gap-6 md:grid-cols-3 md:gap-8">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.12, duration: 0.35 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`inline-flex rounded-full border px-4 py-1.5 font-semibold text-xs uppercase tracking-[0.22em] ${item.badgeClass}`}
                  >
                    {item.phase}
                  </div>

                  <div className="mt-5 flex flex-col items-center">
                    <div
                      className={`h-5 w-5 rounded-full ring-4 ring-background ${item.dotClass}`}
                    />
                    <div
                      className={`mt-3 h-14 w-px bg-linear-to-b ${item.lineClass}`}
                    />
                  </div>

                  <div className="w-full rounded-[1.5rem] border border-border/60 bg-background/70 p-6 backdrop-blur">
                    <p
                      className={`font-black text-4xl tracking-tight ${item.yearClass}`}
                    >
                      {item.year}
                    </p>
                    <h3 className="mt-4 font-semibold text-foreground text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <InfoPanel className="max-w-3xl p-8 text-center text-lg leading-relaxed">
            <p>
              Trái với vẻ ngoài giống C++, trình biên dịch đầu tiên của Rust
              chứa 38.000 dòng mã{" "}
              <strong className="text-pink-400">OCaml</strong> - một ngôn ngữ
              thuần hàm. Rust thực chất là các{" "}
              <em>lý thuyết học thuật cổ điển</em> đội lốt một ngôn ngữ lập
              trình hệ thống hiện đại.
            </p>
          </InfoPanel>
        </div>
      </SlideBody>
    </SlideFrame>
  );
}
