import React, { useState } from 'react'; // useStateをインポート
import { Link } from 'react-router-dom';
import { Menu, CalendarDays, Info } from 'lucide-react'; // Menu, CalendarDays, Infoアイコンをインポート
import { Button } from '@/components/ui/button'; // Buttonコンポーネントをインポート
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'; // Sheetコンポーネントをインポート

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Sheetの開閉状態を管理

  const navLinks = (
    <>
      <li className="ms-2">
        <Link
          to="/"
          className="hover:underline flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          イベント一覧
        </Link>
      </li>
      <li className="ms-2">
        <Link
          to="/about"
          className="hover:underline flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <Info className="h-4 w-4 mr-2" />
          このサイトについて
        </Link>
      </li>
      {/* 将来的にカレンダーなどのリンクを追加 */}
    </>
  );

  return (
    <header className="bg-blue-500 text-white p-4 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          ルミナス所属アイドル ライブ情報まとめ(非公式)
        </Link>

        {/* PC版ナビゲーション */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">{navLinks}</ul>
        </nav>

        {/* スマホ版ハンバーガーメニュー */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-blue-500 text-white">
              <SheetHeader></SheetHeader>
              <nav className="mt-8">
                <ul className="flex flex-col space-y-4">{navLinks}</ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
