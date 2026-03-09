import { motion } from "motion/react";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function DNASlide() {
  return (
    <Slide>
      <SlideTitle>Kỷ nguyên Mozilla & DNA của Rust</SlideTitle>
      <SlideSubtitle>
        Từ một dự án cá nhân (2006) đến chuẩn mực mới (2015)
      </SlideSubtitle>
      <SlideContent>
        <div className="mt-8 flex flex-col items-center space-y-16">
          <div className="relative flex w-full max-w-4xl items-center justify-between py-8">
            <div className="absolute top-1/2 right-0 left-0 -z-10 h-1 bg-border" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="h-6 w-6 rounded-full border-4 border-background bg-muted-foreground" />
              <span className="font-bold text-2xl">2006</span>
              <p className="w-32 text-center text-muted-foreground text-sm leading-snug">
                Dự án cá nhân
                <br />
                (Graydon Hoare)
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="h-6 w-6 rounded-full border-4 border-background bg-orange-500" />
              <span className="font-bold text-2xl text-orange-500">2009</span>
              <p className="w-32 text-center text-muted-foreground text-sm leading-snug">
                Mozilla
                <br />
                Tài trợ
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="h-6 w-6 rounded-full border-4 border-background bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <span className="font-bold text-2xl text-emerald-500">2015</span>
              <p className="w-32 text-center text-muted-foreground text-sm leading-snug">
                Rust 1.0
                <br />
                Phát hành
              </p>
            </motion.div>
          </div>

          <div className="max-w-3xl rounded-xl border border-border bg-card p-8 text-center text-card-foreground text-lg leading-relaxed">
            <p>
              Trái với vẻ ngoài giống C++, trình biên dịch đầu tiên của Rust
              chứa 38.000 dòng mã{" "}
              <strong className="text-pink-400">OCaml</strong> - một ngôn ngữ
              thuần hàm. Rust thực chất là các{" "}
              <em>lý thuyết học thuật cổ điển</em> đội lốt một ngôn ngữ lập
              trình hệ thống hiện đại.
            </p>
          </div>
        </div>
      </SlideContent>
    </Slide>
  );
}
