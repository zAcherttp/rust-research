import { motion } from "motion/react";
import { Slide, SlideContent, SlideTitle } from "../slide";

export function GrandConclusionSlide() {
  return (
    <Slide className="text-center">
      <SlideTitle className="mt-8 mb-12 bg-linear-to-r from-orange-400 to-rose-400 bg-clip-text font-black text-5xl text-transparent tracking-tight lg:text-6xl">
        Tương lai của Lập trình Hệ thống
      </SlideTitle>
      <SlideContent>
        <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col items-center space-y-12">
          <p className="max-w-5xl font-light text-2xl text-foreground/80 leading-relaxed">
            Rust không sáng tạo ra một phép màu mới. Nó tổng hợp những hệ tư
            tưởng xuất sắc nhất của lịch sử: Quản lý vùng nhớ, Lập trình hàm,
            Đơn hình hóa tĩnh. Bằng cách dịch chuyển chi phí phát hiện lỗi từ{" "}
            <strong className="rounded bg-red-950/30 px-2 text-red-400">
              Lúc chạy (Runtime)
            </strong>{" "}
            sang{" "}
            <strong className="rounded bg-green-950/30 px-2 text-green-400">
              Lúc biên dịch (Compile-time)
            </strong>
            , Rust đã giải quyết bài toán nan giải.
          </p>

          <div className="mt-8 grid w-full max-w-5xl grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-lg"
            >
              <div className="absolute top-0 h-1 w-full bg-blue-500" />
              <span className="mb-3 block font-bold text-2xl text-blue-400 uppercase tracking-widest">
                Hiệu năng
              </span>
              <span className="text-lg text-muted-foreground">
                Nhanh như C / C++
              </span>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-lg"
            >
              <div className="absolute top-0 h-1 w-full bg-green-500" />
              <span className="mb-3 block font-bold text-2xl text-green-400 uppercase tracking-widest">
                An toàn
              </span>
              <span className="text-lg text-muted-foreground">
                Mạnh như ML / Haskell
              </span>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-lg"
            >
              <div className="absolute top-0 h-1 w-full bg-orange-500" />
              <span className="mb-3 block font-bold text-2xl text-orange-400 uppercase tracking-widest">
                Tooling
              </span>
              <span className="text-lg text-muted-foreground">
                Hiện đại như NodeJS
              </span>
            </motion.div>
          </div>

          <div className="relative my-10 h-px w-full max-w-5xl bg-linear-to-r from-transparent via-border to-transparent opacity-50" />

          <div className="flex w-full max-w-4xl items-end justify-between px-8">
            <div className="flex flex-col space-y-4 text-left">
              <h3 className="font-black text-2xl text-foreground uppercase tracking-wider">
                Q & A
              </h3>
              <ul className="space-y-3 font-mono text-lg text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="text-orange-500">👉</span>{" "}
                  github.com/rust-lang/rust
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-500">👉</span>{" "}
                  doc.rust-lang.org/book
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-500">👉</span>{" "}
                  doc.rust-lang.org/rust-by-example
                </li>
              </ul>
            </div>
            <div className="group flex flex-col items-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-border border-dashed bg-muted/50 shadow-xl transition-colors group-hover:border-orange-500">
                <span className="font-bold text-muted-foreground uppercase tracking-widest">
                  [QR CODE]
                </span>
              </div>
              <p className="mt-6 font-bold text-orange-400/80 text-sm uppercase tracking-[0.2em]">
                Quét để xem lại Demo
              </p>
            </div>
          </div>
        </div>
      </SlideContent>
    </Slide>
  );
}
