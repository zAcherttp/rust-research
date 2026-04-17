import {
  InfoPanel,
  PlaceholderPanel,
  SlideBody,
  SlideFrame,
  SlideHeader,
  SlideSubtitle,
  SlideTitle,
} from "../slide";

export function FunctionalSlide() {
  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Lập trình Hàm & Tránh Lỗi Tỷ Đô</SlideTitle>
        <SlideSubtitle>
          Null pointers đã lỗi thời. ADTs là tương lai.
        </SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center space-y-12">
          <PlaceholderPanel className="h-56 max-w-4xl">
            [Placeholder: Hình ảnh con trỏ Null biến thành hộp sọ, bị đập vỡ bởi
            thanh kiếm Option&lt;T&gt; và Result&lt;T, E&gt;]
          </PlaceholderPanel>

          <div className="grid w-full grid-cols-1 gap-8 text-center lg:grid-cols-2">
            <InfoPanel title="Option&lt;T&gt;" className="h-full text-center">
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
            </InfoPanel>

            <InfoPanel
              title="Result&lt;T, E&gt;"
              className="h-full text-center"
            >
              <p className="text-base text-muted-foreground leading-relaxed">
                Không còn Try-Catch exceptions ngầm định.
                <br />
                Lỗi là 1 giá trị và ép buộc xử lý bằng{" "}
                <strong className="text-pink-400">Pattern Matching</strong>{" "}
                (Khớp mẫu).
              </p>
            </InfoPanel>
          </div>

          <p className="w-full max-w-3xl border-border border-t pt-4 text-center text-foreground/80 text-lg leading-relaxed">
            Rust kế thừa sức mạnh tột đỉnh từ{" "}
            <strong className="text-blue-400">Haskell</strong> và{" "}
            <strong className="text-orange-400">OCaml</strong>, bắt buộc bạn bảo
            đảm luồng xử lý lỗi được hoàn thiện 100% trước khi có thể biên dịch.
          </p>
        </div>
      </SlideBody>
    </SlideFrame>
  );
}
