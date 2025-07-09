import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  CalendarDays,
  CalendarCheck,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

const TITLES: Record<string, string> = {
  '/': '開催予定のライブ',
  '/past': '過去のライブ',
  '/about': 'このサイトについて',
};

const TARGETS = [
  {
    id: 'mofcro',
    name: 'もふる×クロス',
    short_name: 'もふクロ',
  },
  {
    id: 'girudoru',
    name: '新世界ギルドール',
    short_name: '新ギル',
  },
  {
    id: 'mofrurock',
    name: 'MofruRock',
    short_name: 'MofruRock',
  },
  {
    id: 'osahoto',
    name: '推さぬなら推させてみようホトトギス',
    short_name: '推さホト',
  },
];

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const base = import.meta.env.BASE_URL; // 例: "/app/"
  const relativePath = location.pathname.replace(new RegExp(`^${base}`), '/');
  const title = TITLES[relativePath];

  const menuLinks = (
    <>
      <li className="ms-2">
        <Link
          to="/"
          className="hover:underline flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          {TITLES['/']}
        </Link>
      </li>
      <li className="ms-2">
        <Link
          to="/past"
          className="hover:underline flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <CalendarCheck className="h-4 w-4 mr-2" />
          {TITLES['/past']}
        </Link>
      </li>
      <li className="ms-2">
        <Link
          to="/about"
          className="hover:underline flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <Info className="h-4 w-4 mr-2" />
          {TITLES['/about']}
        </Link>
      </li>
      <hr className="my-3 border-gray-300" />
      <li className="ms-2 mt-2 text-sm text-gray-600">lit.link</li>
      {TARGETS.map((target) => (
        <li key={target.id} className="ms-6">
          <Link
            to={`https://lit.link/${target.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {target.name}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <header className="bg-header-bg p-2 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-header-bg w-72">
                <SheetHeader>
                  <SheetTitle onClick={() => setIsOpen(false)}>
                    ルミナス所属アイドル
                    <br />
                    ライブ情報まとめ(非公式)
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    ルミナス所属のアイドルのライブ情報まとめページです。
                  </SheetDescription>
                </SheetHeader>
                <nav className="mt-8">
                  <ul className="flex flex-col space-y-4">{menuLinks}</ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="text-2xl font-semibold whitespace-nowrap">
            {title}
          </div>
        </div>
      </div>
    </header>
  );
};
