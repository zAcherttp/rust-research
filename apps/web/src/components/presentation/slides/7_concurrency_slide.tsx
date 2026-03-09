import { motion } from "motion/react";
import { CodeBlock } from "../code_block";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function ConcurrencyEcosystemSlide() {
  return (
    <Slide>
      <SlideTitle>Tính Đồng thời: Lãnh địa tử thần</SlideTitle>
      <SlideSubtitle>Erlang, Go và Rust đối mặt với Đa luồng</SlideSubtitle>
      <SlideContent>
        <div className="relative mt-12 flex h-full w-full max-w-5xl flex-col space-y-6 px-4">
          {/* Decorative background grid line */}
          <div className="absolute top-0 bottom-0 left-10 -z-10 w-px bg-border" />

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative flex items-center gap-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
          >
            <div className="absolute -left-3 h-6 w-6 rounded-full border-4 border-red-500 bg-red-950" />
            <div className="w-40 shrink-0 pl-4 text-center font-bold text-3xl text-red-500 uppercase tracking-widest">
              Erlang
            </div>
            <div className="border-border border-l pl-6">
              <h4 className="mb-1 font-semibold text-foreground text-xl tracking-wide">
                Actor Model
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tuyệt đối không chia sẻ bộ nhớ. Giao tiếp qua message passing
                độc lập hoàn toàn.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative flex items-center gap-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
          >
            <div className="absolute -left-3 h-6 w-6 rounded-full border-4 border-blue-500 bg-blue-950" />
            <div className="w-40 shrink-0 pl-4 text-center font-bold text-3xl text-blue-500 uppercase tracking-widest">
              Golang
            </div>
            <div className="border-border border-l pl-6">
              <h4 className="mb-1 font-semibold text-foreground text-xl tracking-wide">
                Goroutines & Channels
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "Đừng chia sẻ bộ nhớ để giao tiếp". Nhưng vẫn <em>cho phép</em>{" "}
                sửa chung biến trong bóng tối và dễ gây crash rò rỉ (Race
                Condition).
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="relative flex items-center gap-8 rounded-xl border-2 border-orange-500/30 bg-orange-950/20 p-6 shadow-lg"
          >
            <div className="absolute -left-3.5 h-7 w-7 rounded-full border-4 border-orange-500 bg-orange-950 shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
            <div className="w-40 shrink-0 pl-4 text-center font-bold text-3xl text-orange-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
              Rust
            </div>
            <div className="border-orange-500/30 border-l pl-6">
              <h4 className="mb-1 font-semibold text-orange-400 text-xl tracking-wide">
                Fearless Concurrency
              </h4>
              <p className="text-foreground/80 text-sm leading-relaxed">
                Áp dụng lại chính quy luật Ownership vào cấp độ luồng. Giao tiếp
                hay chia sẻ bộ nhớ đều được, nhưng{" "}
                <strong className="text-orange-300">
                  trình biên dịch khóa cứng Data Race ngay từ lúc gõ code
                </strong>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </SlideContent>
    </Slide>
  );
}

export function FearlessConcurrencySlide() {
  return (
    <Slide>
      <SlideTitle>Fearless Concurrency (Deep Dive)</SlideTitle>
      <SlideSubtitle>Tuyệt kĩ Send & Sync triệt tiêu Data Race</SlideSubtitle>
      <SlideContent>
        <div className="mt-12 grid h-full w-full max-w-6xl grid-cols-[1.5fr_1fr] items-center gap-12">
          <div className="flex h-full flex-col justify-center space-y-6">
            <CodeBlock
              filename="mutex.rs"
              themeConfig="normal"
              code={
                "use std::sync::Mutex;\n\n// Khác hệ thống cũ: Mutex *sở hữu* dữ liệu của nó!\nlet m = Mutex::new(5);\n\n{\n    // Không thể chạm vào dữ liệu nếu không lấy khóa!\n    let mut num = m.lock().unwrap();\n    *num = 6;\n} // Khóa tự nhả khi data ra khỏi vòng đời (scope)"
              }
            />
            <p className="rounded-r-lg border-orange-500 border-l-4 bg-orange-950/20 py-2 pl-4 text-foreground/80 text-sm leading-relaxed">
              Nếu bạn vô tình đẩy một con trỏ không an toàn sang luồng khác,
              compiler sẽ đánh hơi thấy thiếu cờ{" "}
              <code className="rounded bg-black/40 px-1 text-pink-400">
                Send
              </code>{" "}
              hoặc{" "}
              <code className="rounded bg-black/40 px-1 text-pink-400">
                Sync
              </code>{" "}
              và từ chối biên dịch. Race condition bị tiêu diệt từ vạch xuất
              phát!
            </p>
          </div>
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-red-500/50 border-dashed bg-red-950/10 p-8">
            <div className="space-y-4 text-center text-red-400/80 italic">
              [Placeholder: Hình ảnh biến được bọc trong ổ khóa Mutex. Một con
              trỏ Data Race lén lút tiếp cận bị tóm gọn bởi biển báo cấm
              Send/Sync đỏ chói.]
            </div>
          </div>
        </div>
      </SlideContent>
    </Slide>
  );
}
