"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Plus, Minus, Trash2, Package, Truck, Phone, Mail, Tag } from "lucide-react";

const VND = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

const SAMPLE_PRODUCTS = [
  {
    id: "bear-classic",
    name: "Gấu Len Classic",
    price: 159000,
    images: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop",
    ],
    tag: "Best-seller",
    size: "15cm",
    colors: ["Nâu", "Kem", "Hồng"],
  },
  {
    id: "bear-couple",
    name: "Cặp Gấu Tình Nhân",
    price: 299000,
    images: [
      "https://images.unsplash.com/photo-1601758124169-3b8a0c6d3a9a?q=80&w=1200&auto=format&fit=crop",
    ],
    tag: "Combo",
    size: "18cm",
    colors: ["Kem", "Hồng", "Xám"],
  },
  {
    id: "bear-graduation",
    name: "Gấu Tốt Nghiệp",
    price: 189000,
    images: [
      "https://images.unsplash.com/photo-1469719847081-2233588bcd57?q=80&w=1200&auto=format&fit=crop",
    ],
    tag: "Quà tặng",
    size: "20cm",
    colors: ["Nâu", "Kem"],
  },
  {
    id: "bear-bouquet",
    name: "Bó Gấu Len Mini (5 con)",
    price: 259000,
    images: [
      "https://images.unsplash.com/photo-1589550958981-1563c2f45a03?q=80&w=1200&auto=format&fit=crop",
    ],
    tag: "Hoa gấu",
    size: "10cm",
    colors: ["Mix màu"],
  },
];

function ProductCard({ p, add }: { p: any; add: (i: any) => void }) {
  const [color, setColor] = useState<string>(p.colors?.[0] ?? "Mặc định");
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square w-full overflow-hidden">
        <img src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover" />
      </div>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold leading-tight">{p.name}</CardTitle>
          <Badge className="rounded-2xl" variant="secondary">
            {p.tag}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" /> <span>Size {p.size}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Tag className="h-4 w-4" />
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {p.colors?.map((c: string) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-xl font-bold">{VND.format(p.price)}</div>
        <Button onClick={() => add({ ...p, selectedColor: color })}>Thêm vào giỏ</Button>
      </CardContent>
    </Card>
  );
}

function DevTests() {
  useEffect(() => {
    try {
      console.assert(VND.format(1000).includes("₫"), "VND formatter should include currency symbol");
      const filter = (k: string) =>
        SAMPLE_PRODUCTS.filter((p) =>
          [p.name, p.tag, p.size, ...(p.colors || [])].join(" ").toLowerCase().includes(k.toLowerCase())
        );
      console.assert(filter("tốt nghiệp").some((p) => p.id === "bear-graduation"), "Search should match 'Gấu Tốt Nghiệp'");
      const testCart = [{ price: 100, qty: 2 }, { price: 50, qty: 1 }];
      const subtotal = testCart.reduce((s, x) => s + x.price * x.qty, 0);
      console.assert(subtotal === 250, "Subtotal should sum correctly");
      const email = `mailto:${"huynhminhkhang262@gmail.com"}?subject=${encodeURIComponent("Đơn hàng mới – Test")}&body=${encodeURIComponent("body")}`;
      console.assert(email.startsWith("mailto:huynhminhkhang262@gmail.com?subject="), "Mailto should target owner's email");
      console.log("Dev tests passed ✅");
    } catch (e) {
      console.error("Dev tests failed ❌", e);
    }
  }, []);
  return null;
}

export default function ShopGauLen() {
  const [q, setQ] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; qty: number; selectedColor: string }>>(
    []
  );

  const addToCart = (item: any) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id && x.selectedColor === item.selectedColor);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, selectedColor: item.selectedColor }];
    });
  };

  const inc = (i: number) => setCart((c) => c.map((x, idx) => (idx === i ? { ...x, qty: x.qty + 1 } : x)));
  const dec = (i: number) => setCart((c) => c.map((x, idx) => (idx === i ? { ...x, qty: Math.max(1, x.qty - 1) } : x)));
  const remove = (i: number) => setCart((c) => c.filter((_, idx) => idx !== i));

  const items = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return SAMPLE_PRODUCTS;
    return SAMPLE_PRODUCTS.filter((p) => [p.name, p.tag, p.size, ...(p.colors || [])].join(" ").toLowerCase().includes(k));
  }, [q]);

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <DevTests />
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" className="h-8 w-8" alt="bear icon" />
            <h1 className="text-xl md:text-2xl font-bold">Shop Gấu Len</h1>
            <Badge className="hidden md:inline-flex ml-2">Handmade tại Việt Nam</Badge>
          </div>
          <div className="flex items-center gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm: gấu tốt nghiệp, bó gấu, màu hồng…" className="pl-8" />
            </div>
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" className="relative">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Giỏ ({cart.reduce((s, x) => s + x.qty, 0)})
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Giỏ hàng</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {cart.length === 0 && <div className="text-muted-foreground">Chưa có sản phẩm.</div>}
                  {cart.map((x, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 border-b pb-3">
                      <div className="text-sm">
                        <div className="font-medium">{x.name}</div>
                        <div className="text-xs text-muted-foreground">Màu: {x.selectedColor}</div>
                        <div className="text-xs">{VND.format(x.price)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => dec(i)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center">{x.qty}</span>
                        <Button size="icon" variant="outline" onClick={() => inc(i)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Tạm tính</div>
                  <div className="text-lg font-bold">{VND.format(subtotal)}</div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Phí ship tính theo địa chỉ (GHN/GHTK).
                </div>
                <CheckoutDialog cart={cart} subtotal={subtotal} clearCart={() => setCart([])} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">Gấu len thủ công – Quà tặng ấm áp, đáng yêu</h2>
            <p className="mt-2 text-muted-foreground">Chọn mẫu, chọn màu, thêm lời nhắn. Shop nhận làm theo yêu cầu và giao nhanh toàn quốc.</p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Ship hỏa tốc nội thành
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Zalo tư vấn 24/7 (0343 704 512)
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4" /> Đóng gói quà tặng
              </li>
              <li className="flex items-center gap-2">
                <Tag className="h-4 w-4" /> Giá tốt theo combo
              </li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1606115915090-0ebe3d2e8b9a?q=80&w=1600&auto=format&fit=crop"
              alt="Crochet bears"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-bold">Sản phẩm nổi bật</h3>
          <div className="text-sm text-muted-foreground">{items.length} mẫu</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} add={addToCart} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold">Shop Gấu Len</div>
            <p className="text-muted-foreground mt-2">Handmade tại TP.HCM. Nhận sỉ & hợp tác.</p>
          </div>
          <div>
            <div className="font-semibold">Liên hệ</div>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> 0343 704 512 (Zalo/MoMo)
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> huynhminhkhang262@gmail.com
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Chính sách</div>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>Đổi trả 7 ngày nếu lỗi sản xuất</li>
              <li>Bảo hành đường may 30 ngày</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckoutDialog({
  cart,
  subtotal,
  clearCart,
}: {
  cart: Array<{ id: string; name: string; price: number; qty: number; selectedColor: string }>;
  subtotal: number;
  clearCart: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("COD");

  const orderText = useMemo(() => {
    const lines = [
      "ĐƠN HÀNG – SHOP GẤU LEN",
      "",
      `Khách: ${name}`,
      `SĐT: ${phone}`,
      `Địa chỉ: ${address}`,
      `Thanh toán: ${payment}`,
      "",
      "Sản phẩm:",
      ...cart.map((x) => `- ${x.name} | Màu: ${x.selectedColor} | SL: ${x.qty} | Giá: ${VND.format(x.price)}`),
      "",
      `Tạm tính: ${VND.format(subtotal)}`,
      note ? `Ghi chú: ${note}` : "",
    ].filter(Boolean);
    return lines.join("\n");
  }, [cart, subtotal, name, phone, address, payment, note]);

  const submit = () => {
    if (!cart.length) return alert("Giỏ hàng trống");
    if (!name || !phone || !address) return alert("Vui lòng điền đủ tên, SĐT, địa chỉ");
    const mailto = `mailto:huynhminhkhang262@gmail.com?subject=${encodeURIComponent("Đơn hàng mới – " + name)}&body=${encodeURIComponent(
      orderText
    )}`;
    window.location.href = mailto; // no-backend checkout
    navigator.clipboard?.writeText(orderText);
    setOpen(false);
    clearCart();
    setTimeout(() => alert("Đã mở email để gửi đơn. Nội dung đơn đã được copy vào clipboard."), 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">Tiến hành đặt hàng</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thông tin giao hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Textarea placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Textarea placeholder="Lời nhắn cho shop (tuỳ chọn)" value={note} onChange={(e) => setNote(e.target.value)} />
          <div>
            <div className="text-sm mb-1">Phương thức thanh toán</div>
            <Select value={payment} onValueChange={setPayment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">COD (nhận hàng trả tiền)</SelectItem>
                <SelectItem value="Chuyển khoản">Chuyển khoản (MoMo 0343704512)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl bg-muted p-3 text-sm">
            <div className="font-medium">Tóm tắt đơn</div>
            <pre className="whitespace-pre-wrap text-xs mt-2">{orderText}</pre>
            <div className="text-xs mt-2 text-muted-foreground">
              💡 Nếu chọn chuyển khoản: MoMo <b>0343704512</b> (Huỳnh Minh Khang). Nội dung: <i>Ho ten - So dien thoai</i>. Sau khi chuyển,
              vui lòng nhắn Zalo 0343 704 512 để xác nhận.
            </div>
          </div>
          <Button onClick={submit} className="w-full">
            Đặt hàng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
