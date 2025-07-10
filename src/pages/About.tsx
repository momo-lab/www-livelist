import { LinkButton } from '@/components/ui/LinkButton';
import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">概要</h2>
        <p className="mb-2">
          このサイトは、ルミナス所属アイドルのライブ出演情報を時系列で整理した、個人による非公式のまとめです。
        </p>
        <ul className="mb-2 list-disc pl-5">
          <li>「開催予定のライブ」には今日以降のライブ予定が表示されます。</li>
          <li>「過去のライブ」にはすでに終了したライブ情報が表示されます。</li>
        </ul>
        <p className="mb-2">
          掲載内容は、各アイドルの
          <LinkButton href="https://lit.link/">lit.link</LinkButton>
          ページに記載されたライブ情報をもとに、自動で収集・整理したものです。
          この情報は定期的に更新されますが、反映までに時間がかかる場合があります。
        </p>
        <p>個人によるまとめであり、所属事務所や lit.link とは一切関係ありません。</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">利用方法</h2>
        <p className="mb-2">どなたでも自由にご覧いただけます。</p>
        <p className="mb-2">
          情報の最新性や正確性には努めておりますが、最新情報は必ず公式アカウント・公式サイトでご確認ください。
        </p>
        <p>情報の誤りや掲載中止のご希望があれば、下記の連絡先までお気軽にご連絡ください。</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">機能説明</h2>
        <h3 className="mb-2 text-lg font-semibold">アイドルの絞り込み</h3>
        <p className="mb-2">
          アイドル名のボタンのON/OFFで、対象のアイドルの表示/非表示を切り替えられます。
          切り替えた結果はブラウザ上に保存されます。
        </p>
        <ul className="mb-2 list-disc pl-5">
          <li>クリック/タップ: そのアイドルの表示/非表示を切り替えます。</li>
          <li>長押し/ロングタップ: そのアイドルのみを表示します。</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">免責事項</h2>
        <p className="mb-2">情報の正確性・網羅性には努めていますが、内容の保証はできません。</p>
        <p className="mb-2">
          このページの利用により生じたいかなる損害・トラブルに対しても、制作者は責任を負いません。
        </p>
        <p>著作権やプライバシーに配慮していますが、問題がある場合は速やかに対応します。</p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">連絡先</h2>
        <p>ご意見・ご要望・削除依頼などは、以下のX(旧Twitter)アカウントまでご連絡ください。</p>
        <p className="flex items-center font-bold">
          <LinkButton href="https://x.com/momolab">@momolab</LinkButton>
        </p>
      </section>
    </div>
  );
};
