import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function FunctionalSlide() {
  return (
    <Slide>
      <SlideTitle>Lập trình Hàm & Tránh Lỗi Tỷ Đô</SlideTitle>
      <SlideSubtitle>
        Null pointers đã lỗi thời. ADTs là tương lai.
      </SlideSubtitle>
      <SlideContent>
        <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center space-y-12">
          <div className="flex h-56 w-full max-w-4xl items-center justify-center rounded-xl border border-border border-dashed bg-muted/50 p-8">
            <div className="px-8 text-center text-muted-foreground italic">
              [Placeholder: Hình ảnh con trỏ Null biến thành hộp sọ, bị đập vỡ
              bởi thanh kiếm Option&lt;T&gt; và Result&lt;T, E&gt;]
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-8 text-center">
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-card p-8">
              <h3 className="mb-4 font-bold font-mono text-2xl text-orange-400">
                Option&lt;T&gt;
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Tuyệt đối không có Null hay Undefined.
                <br />
                Dữ liệu hoặc là{" "}
                <code className="rounded bg-emerald-900/20 px-2 py-0.5 text-emerald-400">
                  Some(giá_trị)
                </code>
                ,<br />
                hoặc là{" "}
                <code className="rounded bg-red-900/20 px-2 py-0.5 text-red-400">
                  None
                </code>
                .
              </p>
            </div>
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-card p-8">
              <h3 className="mb-4 font-bold font-mono text-2xl text-emerald-400">
                Result&lt;T, E&gt;
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Không còn Try-Catch exceptions ngầm định.
                <br />
                Lỗi là 1 giá trị và ép buộc xử lý bằng{" "}
                <strong className="text-pink-400">Pattern Matching</strong>{" "}
                (Khớp mẫu).
              </p>
            </div>
          </div>

          <p className="w-full max-w-3xl border-border border-t pt-4 text-center text-foreground/80 text-lg leading-relaxed">
            Rust kế thừa sức mạnh tột đỉnh từ{" "}
            <strong className="text-blue-400">Haskell</strong> và{" "}
            <strong className="text-orange-400">OCaml</strong>, bắt buộc bạn bảo
            đảm luồng xử lý lỗi được hoàn thiện 100% trước khi có thể biên dịch.
          </p>
        </div>
      </SlideContent>
    </Slide>
  );
}
