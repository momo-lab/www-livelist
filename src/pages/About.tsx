import { Badge } from '@/components/ui/badge';
import { LinkButton } from '@/components/ui/LinkButton';
import { CalendarPlus } from 'lucide-react';
import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="container ml-auto px-4 py-4">
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">概要</h2>
        <p className="ml-2">
          このサイトは、ルミナス所属アイドルのライブ出演情報を時系列で整理した、個人による非公式のまとめです。
        </p>
        <ul className="ml-4 list-disc pl-5">
          <li>「開催予定のライブ」には今日以降のライブ予定が表示されます。</li>
          <li>「過去のライブ」にはすでに終了したライブ情報が表示されます。</li>
        </ul>
        <p className="ml-2">
          掲載内容は、各アイドルの
          <LinkButton href="https://lit.link/">lit.link</LinkButton>
          ページに記載されたライブ情報をもとに、自動で収集・整理したものです。
          この情報は定期的に更新されますが、反映までに時間がかかる場合があります。
        </p>
        <p className="ml-2">
          個人によるまとめであり、所属事務所や lit.link とは一切関係ありません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">利用方法</h2>
        <p className="ml-2">どなたでも自由にご覧いただけます。</p>
        <p className="ml-2">
          情報の最新性や正確性には努めておりますが、最新情報は必ず公式アカウント・公式サイトでご確認ください。
        </p>
        <p className="ml-2">
          情報の誤りや掲載中止のご希望があれば、下記の連絡先までお気軽にご連絡ください。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">機能説明</h2>
        <h3 className="mt-2 text-lg font-semibold">アイドルの絞り込み</h3>
        <p className="ml-2">
          アイドル名のボタンのON/OFFで、対象のアイドルの表示/非表示を切り替えられます。
          切り替えた結果はブラウザ上に保存されます。
        </p>
        <ul className="ml-4 list-disc pl-5">
          <li>クリック/タップ: そのアイドルの表示/非表示を切り替えます。</li>
          <li>長押し/ロングタップ: そのアイドルのみを表示します。</li>
        </ul>
        <h3 className="mt-2 text-lg font-semibold">カレンダー登録</h3>
        <p className="ml-2">
          各ライブ情報の「
          <button className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600">
            <CalendarPlus className="h-4 w-4 me-0.5" />
            <span className="underline me-0.5">登録</span>▾
          </button>
          」リンクより、予定をカレンダーへ登録できます。
          登録時には、以下のように各項目が入力されます。
        </p>
        <ul className="ml-4 list-disc pl-5">
          <li>
            日付: ライブ当日の終日予定として登録されます。
            時刻は含みませんので、必要に応じてご自身で入力してください。
          </li>
          <li>タイトル: 1行目の内容が登録されます。</li>
          <li>場所: 2行目の内容が登録されます。</li>
          <li>説明(メモ): 全文が登録されます。</li>
        </ul>
        <p className="ml-2">
          自動的な調整や整形は行っていませんので、不要な部分がある場合はカレンダー上で自由に編集してください。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">免責事項</h2>
        <p className="ml-2">情報の正確性・網羅性には努めていますが、内容の保証はできません。</p>
        <p className="ml-2">
          このページの利用により生じたいかなる損害・トラブルに対しても、制作者は責任を負いません。
        </p>
        <p className="ml-2">
          著作権やプライバシーに配慮していますが、問題がある場合は速やかに対応します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">更新履歴</h2>

        <div className="ml-2">
          <h3 className="font-semibold">2026-01-04</h3>
          <ul className="list-disc pl-6 mb-2">
            <li>
              前年の予定がlitlinkに登録されている場合、今年の予定としても再登録されてしまう問題を修正しました。
            </li>
            <li>
              初期表示時のアイドル選択ボタンが全てOFFになってしまう問題を修正しました。
            </li>
          </ul>
        </div>

        <div className="ml-2">
          <h3 className="font-semibold">2025-07-19</h3>
          <ul className="list-disc pl-6 mb-2">
            <li>予定をカレンダーに登録できるようにしました。</li>
            <li>役目を終えたのでGoogle Spreadsheet版の旧サイトの公開を停止しました。</li>
            <li>アイコンを書き直しました。</li>
          </ul>
        </div>

        <div className="ml-2">
          <h3 className="font-semibold">2025-07-17</h3>
          <ul className="list-disc pl-6 mb-2">
            <li>日付の表示を調整しました。</li>
          </ul>
        </div>

        <div className="ml-2">
          <h3 className="font-semibold">2025-07-16</h3>
          <ul className="list-disc pl-6 mb-2">
            <li>過去のライブのページで期間の絞り込み機能を追加しました。</li>
            <li>
              今日の日付の欄に「
              <Badge className="px-1 py-0.5 text-xs font-normal bg-amber-100 text-amber-800">
                本日
              </Badge>
              」と出すようにしました。
            </li>
            <li>更新履歴(これ)を追加しました。</li>
          </ul>
        </div>

        <div className="ml-2">
          <h3 className="font-semibold">2025-07-15</h3>
          <ul className="list-disc pl-6 mb-2">
            <li>デザインを調整し、ほんのり色を付けました。</li>
            <li>各種SNSのリンクを追加しました。</li>
          </ul>
        </div>

        <div className="ml-2">
          <h3 className="font-semibold">2025-07-11</h3>
          <ul className="list-disc pl-6 mb-2">
            <li>ちゃんとサイトを作成してある意味正式に公開しました。</li>
            <li>アイドルの絞り込み機能を追加しました。</li>
          </ul>
        </div>

        <div className="ml-2">
          <h3 className="font-semibold">2025-07-01</h3>
          <ul className="list-disc pl-6 mb-2">
            <li>Google Spreadsheet版の旧サイトを公開しました。</li>
          </ul>
        </div>

        <div className="ml-2">
          <h3 className="font-semibold">2025-06-25</h3>
          <ul className="list-disc pl-6 mb-2">
            <li>lit.linkからの定期的なデータ収集を始めました。</li>
          </ul>
        </div>

        <div className="ml-2">
          <h3 className="font-semibold">2025-06-24</h3>
          <ul className="list-disc pl-6 mb-2">
            <li>lit.linkのライブ情報が収集可能と気づき、このサイトを作り始めました。</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">連絡先</h2>
        <p className="ml-2">
          ご意見・ご要望・削除依頼などは、以下のX(旧Twitter)アカウントまでご連絡ください。
        </p>
        <p className="ml-8 font-bold">
          <LinkButton href="https://x.com/momolab">@momolab</LinkButton>
        </p>
      </section>
    </div>
  );
};
