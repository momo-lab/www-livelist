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
import { CalendarCheck, CalendarDays, ExternalLink, Info, Menu } from 'lucide-react';
import React, { useState } from 'react';
import { FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';

import { SocialLinkItem } from './SocialLinkItem';

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
      {idols.map((idol) => (
        <li key={idol.id} className="px-2 flex flex-col items-start">
          <span className="text-foreground mb-2">{idol.name}</span>
          <div className="flex gap-4 ps-4">
            <SocialLinkItem
              to={`https://lit.link/${idol.id}`}
              icon={ExternalLink}
              siteName="lit.link"
              onClick={() => setIsOpen(false)}
            />
            <SocialLinkItem
              to={idol.twitter_id && `https://x.com/${idol.twitter_id}`}
              icon={FaXTwitter}
              siteName="X.com"
              onClick={() => setIsOpen(false)}
            />
            <SocialLinkItem
              to={idol.tiktok_id && `https://www.tiktok.com/@${idol.tiktok_id}`}
              icon={FaTiktok}
              siteName="TikTok"
              onClick={() => setIsOpen(false)}
            />
            <SocialLinkItem
              to={idol.instagram_id && `https://www.instagram.com/${idol.instagram_id}/`}
              icon={FaInstagram}
              siteName="Instagram"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </li>
      ))}
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
