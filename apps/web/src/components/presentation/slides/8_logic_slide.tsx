import { motion } from "motion/react";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function LogicSlide() {
  return (
    <Slide>
      <SlideTitle>Tính Khai báo & Logic (Prolog)</SlideTitle>
      <SlideSubtitle>
        Hệ thống Trait của Rust có tính tương đồng cực lớn
      </SlideSubtitle>
      <SlideContent>
        <div className="mt-4 flex h-full flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-linear-to-br from-card to-background p-16 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
          >
            {/* Background decorative glow */}
            <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
            <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />

            <p className="relative z-10 font-light text-3xl text-foreground/80 italic leading-[2.5]">
              Ngay cả mô hình lập trình logic như{" "}
              <strong className="font-bold text-4xl text-blue-400 tracking-wide">
                Prolog
              </strong>{" "}
              cũng xuất hiện trong DNA của Rust.
              <br />
              <br />
              Hệ thống giải quyết Trait của compiler (như engine{" "}
              <span className="rounded-lg border border-orange-500/20 bg-muted px-3 py-1 font-mono text-orange-400 shadow-inner">
                Chalk
              </span>
              ) hoạt động y hệt một công cụ suy luận logic Prolog để duyệt ngược
              qua các điều kiện ràng buộc kiểu phức tạp!
            </p>
          </motion.div>
        </div>
      </SlideContent>
    </Slide>
  );
}
