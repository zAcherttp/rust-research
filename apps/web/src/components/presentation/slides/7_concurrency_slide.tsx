import { motion } from "motion/react";
import {
  CodeStage,
  PlaceholderPanel,
  SlideBody,
  SlideFrame,
  SlideHeader,
  SlideSubtitle,
  SlideTitle,
} from "../slide";

export function ConcurrencyEcosystemSlide() {
  const ecosystems = [
    {
      name: "Erlang",
      title: "Actor Model",
      description:
        "Tuyệt đối không chia sẻ bộ nhớ. Giao tiếp qua message passing độc lập hoàn toàn.",
      wrapperClassName: "border-zinc-800 bg-zinc-900/40",
      dotClassName: "border-red-500 bg-red-950",
      nameClassName: "text-red-500",
      titleClassName: "text-foreground",
      bodyClassName: "text-muted-foreground",
    },
    {
      name: "Golang",
      title: "Goroutines & Channels",
      description:
        '"Đừng chia sẻ bộ nhớ để giao tiếp". Nhưng vẫn cho phép sửa chung biến trong bóng tối và dễ gây crash rò rỉ (Race Condition).',
      wrapperClassName: "border-zinc-800 bg-zinc-900/40",
      dotClassName: "border-blue-500 bg-blue-950",
      nameClassName: "text-blue-500",
      titleClassName: "text-foreground",
      bodyClassName: "text-muted-foreground",
    },
    {
      name: "Rust",
      title: "Fearless Concurrency",
      description:
        "Áp dụng lại chính quy luật Ownership vào cấp độ luồng. Giao tiếp hay chia sẻ bộ nhớ đều được, nhưng trình biên dịch khóa cứng Data Race ngay từ lúc gõ code.",
      wrapperClassName:
        "border-2 border-orange-500/30 bg-orange-950/20 shadow-lg",
      dotClassName:
        "border-orange-500 bg-orange-950 shadow-[0_0_15px_rgba(249,115,22,0.5)]",
      nameClassName:
        "text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]",
      titleClassName: "text-orange-400",
      bodyClassName: "text-foreground/80",
    },
  ];

  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Tính Đồng thời: Lãnh địa tử thần</SlideTitle>
        <SlideSubtitle>
          Erlang, Go và Rust đối mặt với Đa luồng
        </SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <div className="relative mt-12 flex h-full w-full max-w-5xl flex-col space-y-6 px-4">
          <div className="absolute top-0 bottom-0 left-10 -z-10 w-px bg-border" />

          {ecosystems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.2 }}
              className={`relative flex items-center gap-8 rounded-xl p-6 ${item.wrapperClassName}`}
            >
              <div
                className={`absolute -left-3 h-6 w-6 rounded-full border-4 ${item.dotClassName}`}
              />
              <div
                className={`w-40 shrink-0 pl-4 text-center font-bold text-3xl uppercase tracking-widest ${item.nameClassName}`}
              >
                {item.name}
              </div>
              <div className="border-border border-l pl-6">
                <h4
                  className={`mb-1 font-semibold text-xl tracking-wide ${item.titleClassName}`}
                >
                  {item.title}
                </h4>
                <p className={`text-sm leading-relaxed ${item.bodyClassName}`}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </SlideBody>
    </SlideFrame>
  );
}

export function FearlessConcurrencySlide() {
  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Fearless Concurrency (Deep Dive)</SlideTitle>
        <SlideSubtitle>
          Tuyệt kĩ Send & Sync triệt tiêu Data Race
        </SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <CodeStage
          filename="mutex.rs"
          themeConfig="normal"
          code={
            "use std::sync::Mutex;\n\n// Khác hệ thống cũ: Mutex *sở hữu* dữ liệu của nó!\nlet m = Mutex::new(5);\n\n{\n    // Không thể chạm vào dữ liệu nếu không lấy khóa!\n    let mut num = m.lock().unwrap();\n    *num = 6;\n} // Khóa tự nhả khi data ra khỏi vòng đời (scope)"
          }
          gridClassName="mt-12 max-w-6xl grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
          narrative={
            <p className="rounded-r-lg border-orange-500 border-l-4 bg-orange-950/20 py-2 pl-4 text-foreground/80">
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
          }
          aside={
            <PlaceholderPanel className="min-h-[300px] border-red-500/50 bg-red-950/10 text-red-400/80">
              [Placeholder: Hình ảnh biến được bọc trong ổ khóa Mutex. Một con
              trỏ Data Race lén lút tiếp cận bị tóm gọn bởi biển báo cấm
              Send/Sync đỏ chói.]
            </PlaceholderPanel>
          }
        />
      </SlideBody>
    </SlideFrame>
  );
}
