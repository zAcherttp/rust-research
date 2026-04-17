import {
  MetricCard,
  PlaceholderPanel,
  SlideBody,
  SlideFrame,
  SlideHeader,
  SlideTitle,
} from "../slide";

export function GrandConclusionSlide() {
  return (
    <SlideFrame className="items-center text-center">
      <SlideHeader className="flex flex-col items-center">
        <SlideTitle className="mt-8 bg-linear-to-r from-orange-400 to-rose-400 bg-clip-text font-black text-5xl text-transparent lg:text-6xl">
          Tương lai của Lập trình Hệ thống
        </SlideTitle>
      </SlideHeader>

      <SlideBody className="items-center">
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

          <div className="mt-8 grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
            <MetricCard
              title={<span className="text-blue-400">Hiệu năng</span>}
              accentClassName="bg-blue-500"
              revealIndex={0}
            >
              Nhanh như C / C++
            </MetricCard>
            <MetricCard
              title={<span className="text-green-400">An toàn</span>}
              accentClassName="bg-green-500"
              revealIndex={1}
            >
              Mạnh như ML / Haskell
            </MetricCard>
            <MetricCard
              title={<span className="text-orange-400">Tooling</span>}
              accentClassName="bg-orange-500"
              revealIndex={2}
            >
              Hiện đại như NodeJS
            </MetricCard>
          </div>

          <div className="relative my-10 h-px w-full max-w-5xl bg-linear-to-r from-transparent via-border to-transparent opacity-50" />

          <div className="flex w-full max-w-4xl flex-col items-center justify-between gap-12 px-8 lg:flex-row lg:items-end">
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
              <PlaceholderPanel className="h-40 min-h-40 w-40 border-2 bg-muted/50 text-center font-bold uppercase tracking-widest shadow-xl transition-colors group-hover:border-orange-500">
                [QR CODE]
              </PlaceholderPanel>
              <p className="mt-6 font-bold text-orange-400/80 text-sm uppercase tracking-[0.2em]">
                Quét để xem lại Demo
              </p>
            </div>
          </div>
        </div>
      </SlideBody>
    </SlideFrame>
  );
}
