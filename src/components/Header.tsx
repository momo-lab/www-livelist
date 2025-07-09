import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, CalendarDays, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = (
    <>
      <li className="ms-2">
        <Link
          to="/"
          className="hover:underline flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          開催予定
        </Link>
      </li>
      <li className="ms-2">
        <Link
          to="/past"
          className="hover:underline flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          過去の履歴
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
    </>
  );

  return (
    <header className="p-4 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* 左側：スマホはハンバーガー＋タイトル、PCはタイトルのみ */}
        <div className="flex items-center space-x-2">
          {/* ハンバーガー（モバイルのみ表示） */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle>
                    ルミナス所属アイドル
                    <br />
                    ライブ情報まとめ(非公式)
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    ルミナス所属のアイドルのライブ情報まとめページです。
                  </SheetDescription>
                </SheetHeader>
                <nav className="mt-8">
                  <ul className="flex flex-col space-y-4">{navLinks}</ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* タイトル */}
          <div className="text-lg font-semibold whitespace-nowrap">abc</div>
        </div>

        {/* 右側：ナビゲーション（PCのみ表示） */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">{navLinks}</ul>
        </nav>
      </div>
    </header>
  );
};
