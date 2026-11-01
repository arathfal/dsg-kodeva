import type { CartRecovery } from "../../../../shared/cart.ts";

// Recovery/restore messaging shared by the cart and checkout pages (D-038):
// both pages describe the same recovery policy with the same wording.
export function cartRecoveryNotices(state: {
  recovery: CartRecovery | null;
  restoreSkipped: boolean;
  storageDenied: boolean;
}): string[] {
  const notices: string[] = [];
  if (state.storageDenied) {
    notices.push(
      "Penyimpanan browser tidak dapat dibaca, sehingga keranjang hanya berlaku selama halaman ini terbuka.",
    );
  }
  if (
    state.recovery?.kind === "wrong-version" ||
    state.recovery?.kind === "corrupt"
  ) {
    notices.push(
      "Format keranjang tersimpan tidak dikenali, sehingga isi tersimpan diabaikan dan keranjang dimulai kosong.",
    );
  } else if (state.recovery?.kind === "recovered") {
    notices.push(
      [
        state.recovery.droppedLines > 0 &&
          `${state.recovery.droppedLines} item tersimpan tidak valid dengan data saat ini dan dihapus.`,
        state.recovery.clampedLines > 0 &&
          `Jumlah pada ${state.recovery.clampedLines} item dikurangi mengikuti sisa kuota.`,
        "Harga subtotal dihitung ulang dari data saat ini.",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }
  if (state.restoreSkipped) {
    notices.push(
      "Isi keranjang tersimpan tidak dimuat karena keranjang pada sesi ini sudah dipakai terlebih dahulu.",
    );
  }
  return notices;
}

export function NoticeList({ notices }: { notices: string[] }) {
  return (
    <div className="space-y-2">
      {notices.map((message) => (
        <p key={message} role="status" className="text-sm text-secondary">
          {message}
        </p>
      ))}
    </div>
  );
}
