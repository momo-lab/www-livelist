import { CalendarCheck, CalendarDays, ExternalLink, Info, Menu, Users } from 'lucide-react';
import React, { useState } from 'react';
import { FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { SocialLinkItem } from '@/components/SocialLinkItem';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

const menus = [
  { path: '/', title: '開催予定のライブ', icon: <CalendarDays className="mr-2 h-4 w-4" /> },
  { path: '/past', title: '過去のライブ', icon: <CalendarCheck className="mr-2 h-4 w-4" /> },
  { path: '/members', title: 'メンバー一覧', icon: <Users className="mr-2 h-4 w-4" /> },
  { path: '/about', title: 'このサイトについて', icon: <Info className="mr-2 h-4 w-4" /> },
];

interface Props {
  right?: React.ReactNode;
}

export function Header({ right }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { idols, updatedAt } = useLiveEvents(); // idolsを取得
  const location = useLocation();

  const base = import.meta.env.BASE_URL; // 例: "/app/"
  const relativePath = location.pathname.replace(new RegExp(`^${base}`), '/');
  const title = menus.find((menu) => menu.path === relativePath)?.title ?? '';

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
              <SheetContent side="left" className="flex h-full w-80 flex-col p-0">
                <SheetHeader className="bg-header-bg text-header-fg px-2 pt-2 text-left">
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
                  <ul className="space-y-4">
                    {menus.map((menu) => (
                      <li key={menu.path} className="mx-2">
                        <Link
                          to={menu.path}
                          className="text-foreground flex items-center hover:underline"
                          onClick={() => setIsOpen(false)}
                        >
                          {menu.icon}
                          {menu.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <hr />
                <nav className="flex-1 overflow-y-auto">
                  <ul className="space-y-4">
                    {idols.map((idol) => (
                      <li key={idol.id} className="flex flex-col items-start px-2">
                        <span className="text-foreground mb-2">{idol.name}</span>
                        <div className="mt-2 flex gap-4 ps-4">
                          <Link
                            to={`/members#${idol.id}`}
                            className="text-foreground flex flex-col items-center hover:underline"
                            onClick={() => setIsOpen(false)}
                          >
                            <Users className="h-8 w-8" />
                            <span className="mt-1 text-xs">メンバー</span>
                          </Link>
                          <SocialLinkItem
                            to={idol.twitter_id && `https://x.com/${idol.twitter_id}`}
                            icon={FaXTwitter}
                            siteName="X.com"
                            onClick={() => setIsOpen(false)}
                          />
                          <SocialLinkItem
                            to={
                              idol.instagram_id && `https://www.instagram.com/${idol.instagram_id}/`
                            }
                            icon={FaInstagram}
                            siteName="Instagram"
                            onClick={() => setIsOpen(false)}
                          />
                          <SocialLinkItem
                            to={idol.tiktok_id && `https://www.tiktok.com/@${idol.tiktok_id}`}
                            icon={FaTiktok}
                            siteName="TikTok"
                            onClick={() => setIsOpen(false)}
                          />
                          <SocialLinkItem
                            to={idol.litlink_id && `https://lit.link/${idol.litlink_id}`}
                            icon={ExternalLink}
                            siteName="lit.link"
                            onClick={() => setIsOpen(false)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </nav>
                <hr />
                <div className="mx-2 mb-4 text-right text-xs opacity-70">
                  {updatedAt &&
                    `※${updatedAt.toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit',
                    })}時点の情報です。`}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="flex-1 text-2xl font-semibold whitespace-nowrap">{title}</div>
        <div>{right}</div>
      </div>
    </header>
  );
}
