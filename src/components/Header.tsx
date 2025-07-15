import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { Archive, CalendarCheck, CalendarDays, ExternalLink, Info, Menu } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TITLES: Record<string, string> = {
  '/': '開催予定のライブ',
  '/past': '過去のライブ',
  '/about': 'このサイトについて',
};

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { idols } = useLiveEvents(); // idolsを取得
  const location = useLocation();

  const base = import.meta.env.BASE_URL; // 例: "/app/"
  const relativePath = location.pathname.replace(new RegExp(`^${base}`), '/');
  const isUpcoming = relativePath === '/';
  const isPast = relativePath === '/past';
  const title = TITLES[relativePath];

  const menuLinks = (
    <>
      <li className="mx-2">
        <Link
          to="/"
          className="text-foreground flex items-center hover:underline"
          onClick={() => setIsOpen(false)}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {TITLES['/']}
        </Link>
      </li>
      <li className="mx-2">
        <Link
          to="/past"
          className="text-foreground flex items-center hover:underline"
          onClick={() => setIsOpen(false)}
        >
          <CalendarCheck className="mr-2 h-4 w-4" />
          {TITLES['/past']}
        </Link>
      </li>
      <li className="mx-2">
        <Link
          to="/about"
          className="text-foreground flex items-center hover:underline"
          onClick={() => setIsOpen(false)}
        >
          <Info className="mr-2 h-4 w-4" />
          {TITLES['/about']}
        </Link>
      </li>
      <hr className="my-3 border-border" />
      <li className="mx-2 mt-2 text-sm text-muted-foreground">lit.link</li>
      {idols.map((idol) => (
        <li key={idol.id} className="ms-6 me-2">
          <Link
            to={`https://lit.link/${idol.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground flex items-center hover:underline"
            onClick={() => setIsOpen(false)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {idol.name}
          </Link>
        </li>
      ))}
      <hr className="my-3 border-border" />
      <li className="mx-2 mt-2 text-sm text-muted-foreground">X.com</li>
      {idols.map((idol) => (
        <li key={idol.id} className="ms-6 me-2">
          <Link
            to={`https://x.com/${idol.twitter_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground flex items-center hover:underline"
            onClick={() => setIsOpen(false)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {idol.name}
          </Link>
        </li>
      ))}
      <hr className="my-3 border-border" />
      <li className="mx-2">
        <Link
          to="https://docs.google.com/spreadsheets/d/e/2PACX-1vSeF4PaaPYeT1TNHS6Yoc2p2-8e8g-pMNSOq-n0OKhr9on10lLdB3ybte0i_iNCKjpbKB0WELg190-2/pubhtml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground flex items-center hover:underline"
          onClick={() => setIsOpen(false)}
        >
          <Archive className="mr-2 h-4 w-4" />
          旧サイト(削除予定)
        </Link>
      </li>
    </>
  );

  return (
    <header className="bg-header-bg text-header-fg fixed top-0 z-50 w-full p-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader className="bg-header-bg text-header-fg">
                  <SheetTitle onClick={() => setIsOpen(false)}>
                    ルミナス所属アイドル
                    <br />
                    ライブ情報まとめ(非公式)
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    ルミナス所属のアイドルのライブ情報まとめページです。
                  </SheetDescription>
                </SheetHeader>
                <nav>
                  <ul className="flex flex-col space-y-4">{menuLinks}</ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="text-2xl font-semibold whitespace-nowrap">{title}</div>
        </div>
        <div>
          {(isUpcoming || isPast) && (
            <Button asChild className="w-20">
              <Link to={isUpcoming ? '/past' : '/'}>{isUpcoming ? '過去分' : '開催予定'}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
