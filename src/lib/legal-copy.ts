import type { Locale } from '@/lib/i18n';

export type LegalLocale = Locale;

export interface LegalSection {
  title: string;
  lead?: string;
  paragraphs?: string[];
  orderedItems?: string[];
  bulletItems?: string[];
}

export interface LegalDocumentCopy {
  heading: string;
  updatedAtLabel: string;
  updatedAt: string;
  sections: LegalSection[];
}

export function resolveLegalLocale(locale: string): LegalLocale {
  if (locale === 'en' || locale === 'zh' || locale === 'ja') return locale;
  return 'ja';
}

export const TERMS_COPY: Record<LegalLocale, LegalDocumentCopy> = {
  ja: {
    heading: '利用規約',
    updatedAtLabel: '最終更新日',
    updatedAt: '2026年4月14日',
    sections: [
      {
        title: '第1条（適用）',
        paragraphs: [
          '本規約は、Sprout（以下「本サービス」）の利用に関するすべての条件を定めるものです。ユーザーは、本サービスを利用することにより、本規約に同意したものとみなされます。',
        ],
      },
      {
        title: '第2条（アカウント）',
        orderedItems: [
          'ユーザーは、正確な情報を提供してアカウントを作成するものとします。',
          'アカウントの管理責任はユーザー自身にあり、第三者への譲渡・貸与はできません。',
          'パスワードの漏洩等による不正利用の責任は、ユーザーが負うものとします。',
        ],
      },
      {
        title: '第3条（禁止事項）',
        lead: 'ユーザーは以下の行為を行ってはなりません。',
        orderedItems: [
          '法令または公序良俗に違反する行為',
          '本サービスの運営を妨害する行為',
          '他のユーザーの個人情報を不正に収集する行為',
          '本サービスを不正な目的で利用する行為',
          '本サービスのリバースエンジニアリング、逆コンパイル等の行為',
          'その他、運営者が不適切と判断する行為',
        ],
      },
      {
        title: '第4条（サービスの提供）',
        orderedItems: [
          '本サービスは「現状有姿」で提供されます。',
          '運営者は、事前の通知なくサービスの内容を変更、または提供を中止できるものとします。',
          '本サービスの提供する情報は、医療上のアドバイスではありません。医療に関する判断は必ず医療専門家にご相談ください。',
        ],
      },
      {
        title: '第5条（免責事項）',
        orderedItems: [
          '本サービスの利用により生じた損害について、運営者は一切の責任を負いません。',
          '本サービスに掲載されている情報の正確性・完全性について保証するものではありません。',
          'サーバー障害、システムメンテナンス等による一時的な利用停止について、運営者は責任を負いません。',
        ],
      },
      {
        title: '第6条（知的財産権）',
        paragraphs: [
          '本サービスに関する著作権、商標権その他の知的財産権は、運営者に帰属します。ユーザーが投稿したコンテンツの著作権はユーザーに帰属しますが、本サービスの運営に必要な範囲で利用を許諾するものとします。',
        ],
      },
      {
        title: '第7条（退会）',
        paragraphs: [
          'ユーザーは、設定画面からいつでもアカウントを削除し、退会することができます。退会時に、ユーザーのデータは合理的な期間内に削除されます。',
        ],
      },
      {
        title: '第8条（規約の変更）',
        paragraphs: [
          '運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本サービス上に掲示した時点で効力を生じるものとします。',
        ],
      },
      {
        title: '第9条（準拠法・管轄）',
        paragraphs: [
          '本規約は日本法に準拠し、本サービスに関する紛争は東京地方裁判所を第一審の専属的合意管轄裁判所とします。',
        ],
      },
    ],
  },
  en: {
    heading: 'Terms of Service',
    updatedAtLabel: 'Last updated',
    updatedAt: 'April 14, 2026',
    sections: [
      {
        title: 'Article 1 (Scope)',
        paragraphs: [
          'These Terms define all conditions for using Sprout (the "Service"). By using the Service, users are deemed to have agreed to these Terms.',
        ],
      },
      {
        title: 'Article 2 (Accounts)',
        orderedItems: [
          'Users must create accounts using accurate information.',
          'Users are responsible for account management and may not transfer or lend accounts to third parties.',
          'Users are responsible for unauthorized use caused by password leaks or similar incidents.',
        ],
      },
      {
        title: 'Article 3 (Prohibited Conduct)',
        lead: 'Users must not engage in any of the following:',
        orderedItems: [
          'Conduct that violates laws or public order and morals',
          'Conduct that interferes with operation of the Service',
          'Unauthorized collection of personal information of other users',
          'Use of the Service for improper purposes',
          'Reverse engineering, decompiling, or similar acts against the Service',
          'Any other conduct deemed inappropriate by the operator',
        ],
      },
      {
        title: 'Article 4 (Service Provision)',
        orderedItems: [
          'The Service is provided on an "as is" basis.',
          'The operator may change service content or suspend provision without prior notice.',
          'Information provided by the Service is not medical advice. Always consult qualified medical professionals for medical decisions.',
        ],
      },
      {
        title: 'Article 5 (Disclaimer)',
        orderedItems: [
          'The operator is not liable for damages arising from use of the Service.',
          'The operator does not guarantee accuracy or completeness of information posted on the Service.',
          'The operator is not responsible for temporary unavailability caused by server failures, maintenance, or similar events.',
        ],
      },
      {
        title: 'Article 6 (Intellectual Property)',
        paragraphs: [
          'Copyrights, trademarks, and other intellectual property related to the Service belong to the operator. Copyright of user-posted content belongs to the user, but users grant permission for use to the extent necessary to operate the Service.',
        ],
      },
      {
        title: 'Article 7 (Account Deletion)',
        paragraphs: [
          'Users may delete their accounts and withdraw at any time from the settings screen. User data will be deleted within a reasonable period after withdrawal.',
        ],
      },
      {
        title: 'Article 8 (Changes to Terms)',
        paragraphs: [
          'The operator may revise these Terms as necessary. Revised Terms become effective when posted on the Service.',
        ],
      },
      {
        title: 'Article 9 (Governing Law and Jurisdiction)',
        paragraphs: [
          'These Terms are governed by Japanese law. The Tokyo District Court has exclusive agreed jurisdiction as the court of first instance for disputes related to the Service.',
        ],
      },
    ],
  },
  zh: {
    heading: '使用条款',
    updatedAtLabel: '最后更新',
    updatedAt: '2026年4月14日',
    sections: [
      {
        title: '第1条（适用范围）',
        paragraphs: [
          '本条款规定了 Sprout（以下简称“本服务”）使用相关的全部条件。用户使用本服务即视为同意本条款。',
        ],
      },
      {
        title: '第2条（账号）',
        orderedItems: [
          '用户应提供准确的信息创建账号。',
          '账号管理责任由用户本人承担，账号不得转让或出借给第三方。',
          '因密码泄露等导致的未授权使用风险由用户承担。',
        ],
      },
      {
        title: '第3条（禁止行为）',
        lead: '用户不得实施以下行为：',
        orderedItems: [
          '违反法律法规或公序良俗的行为',
          '妨碍本服务运营的行为',
          '未经授权收集其他用户个人信息的行为',
          '将本服务用于不正当目的的行为',
          '对本服务进行逆向工程、反编译等行为',
          '其他运营方认定为不适当的行为',
        ],
      },
      {
        title: '第4条（服务提供）',
        orderedItems: [
          '本服务按“现状”提供。',
          '运营方可在不事先通知的情况下变更服务内容或暂停提供服务。',
          '本服务提供的信息不构成医疗建议。涉及医疗判断时，请务必咨询专业医疗人员。',
        ],
      },
      {
        title: '第5条（免责声明）',
        orderedItems: [
          '对于因使用本服务产生的损失，运营方不承担责任。',
          '运营方不保证本服务信息的准确性与完整性。',
          '因服务器故障、系统维护等导致的临时不可用，运营方不承担责任。',
        ],
      },
      {
        title: '第6条（知识产权）',
        paragraphs: [
          '与本服务相关的著作权、商标权及其他知识产权归运营方所有。用户发布内容的著作权归用户所有，但用户同意在运营本服务所必需的范围内授权使用。',
        ],
      },
      {
        title: '第7条（注销）',
        paragraphs: [
          '用户可随时在设置页面删除账号并注销。注销后，用户数据将在合理期限内删除。',
        ],
      },
      {
        title: '第8条（条款变更）',
        paragraphs: [
          '运营方可根据需要修改本条款。修改后的条款在本服务内公示时生效。',
        ],
      },
      {
        title: '第9条（准据法与管辖）',
        paragraphs: [
          '本条款受日本法律管辖。与本服务相关的争议由东京地方法院作为第一审专属协议管辖法院。',
        ],
      },
    ],
  },
};

export const PRIVACY_COPY: Record<LegalLocale, LegalDocumentCopy> = {
  ja: {
    heading: 'プライバシーポリシー',
    updatedAtLabel: '最終更新日',
    updatedAt: '2026年4月14日',
    sections: [
      {
        title: '1. 収集する情報',
        lead: '本サービスでは、以下の情報を収集します。',
        bulletItems: [
          'アカウント情報: メールアドレス、ニックネーム、認証情報（Google認証を含む）',
          'プロフィール情報: 現在のライフステージ、出産予定日、妊娠予定時期',
          '利用データ: チェックリストの完了状況、カスタムタスクの内容',
          '技術情報: IPアドレス、ブラウザ種別、アクセス日時（ログとして自動収集）',
        ],
      },
      {
        title: '2. 情報の利用目的',
        lead: '収集した情報は、以下の目的で利用します。',
        bulletItems: [
          '本サービスの提供・運営・改善',
          'ユーザーサポートへの対応',
          'タスクスケジュールの自動計算機能の提供',
          '家族グループ内でのデータ共有機能の提供',
          '利用状況の分析およびサービス改善',
        ],
      },
      {
        title: '3. 情報の共有',
        bulletItems: [
          '家族グループ: 同じ家族グループに所属するメンバー間で、チェックリストの進捗やタスク情報が共有されます。',
          '第三者提供: 法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。',
          '外部サービス: 認証基盤としてSupabase（米国）を利用しています。',
        ],
      },
      {
        title: '4. データの保管',
        bulletItems: [
          'データはSupabase（クラウドデータベース）に暗号化された接続を通じて保管されます。',
          '行レベルセキュリティ（RLS）により、他の家族グループのデータにアクセスできない仕組みを採用しています。',
          'パスワードはハッシュ化して保存され、平文では保存しません。',
        ],
      },
      {
        title: '5. ユーザーの権利',
        lead: 'ユーザーは以下の権利を有します。',
        bulletItems: [
          'アクセス権: 自身のデータの内容を確認する権利',
          '訂正権: 設定画面からプロフィール情報をいつでも変更できます',
          '削除権: アカウントを削除することで、関連するデータを削除できます',
          'データポータビリティ: 将来的にデータのエクスポート機能を提供予定です',
        ],
      },
      {
        title: '6. Cookieの使用',
        paragraphs: [
          '本サービスでは、認証セッションの維持のためにCookieを使用します。これは本サービスの適切な動作に必要なもので、トラッキング目的のCookieは使用していません。',
        ],
      },
      {
        title: '7. 未成年者の利用',
        paragraphs: [
          '本サービスは主に成人の利用を想定しています。16歳未満の方は、保護者の同意を得た上でご利用ください。',
        ],
      },
      {
        title: '8. ポリシーの変更',
        paragraphs: [
          '本ポリシーは必要に応じて更新される場合があります。重要な変更がある場合は、本サービス上で通知します。',
        ],
      },
      {
        title: '9. お問い合わせ',
        paragraphs: [
          'プライバシーに関するお問い合わせは、本サービスの設定画面内のお問い合わせ機能よりご連絡ください。',
        ],
      },
    ],
  },
  en: {
    heading: 'Privacy Policy',
    updatedAtLabel: 'Last updated',
    updatedAt: 'April 14, 2026',
    sections: [
      {
        title: '1. Information We Collect',
        lead: 'We collect the following information in the Service:',
        bulletItems: [
          'Account information: email address, nickname, authentication details (including Google sign-in)',
          'Profile information: current life stage, estimated due date, planned pregnancy timing',
          'Usage data: checklist completion status and custom task content',
          'Technical information: IP address, browser type, and access timestamps (automatically collected as logs)',
        ],
      },
      {
        title: '2. Purpose of Use',
        lead: 'Collected information is used for the following purposes:',
        bulletItems: [
          'Providing, operating, and improving the Service',
          'Responding to user support requests',
          'Providing automatic task scheduling features',
          'Providing data-sharing features within family groups',
          'Analyzing usage and improving the Service',
        ],
      },
      {
        title: '3. Information Sharing',
        bulletItems: [
          'Family group sharing: checklist progress and task information are shared among members in the same family group.',
          'Third-party provision: we do not provide personal information to third parties without user consent, except where required by law.',
          'External services: we use Supabase (United States) as our authentication infrastructure.',
        ],
      },
      {
        title: '4. Data Storage',
        bulletItems: [
          'Data is stored in Supabase (cloud database) over encrypted connections.',
          'Row Level Security (RLS) is applied so users cannot access data from other family groups.',
          'Passwords are stored as hashes and are never stored in plain text.',
        ],
      },
      {
        title: '5. User Rights',
        lead: 'Users have the following rights:',
        bulletItems: [
          'Right of access: to review their own data',
          'Right of rectification: profile information can be updated anytime from the settings screen',
          'Right of deletion: users can delete related data by deleting their account',
          'Data portability: export functionality is planned for future release',
        ],
      },
      {
        title: '6. Use of Cookies',
        paragraphs: [
          'We use cookies to maintain authentication sessions. These cookies are necessary for proper operation of the Service, and we do not use tracking cookies for advertising purposes.',
        ],
      },
      {
        title: '7. Use by Minors',
        paragraphs: [
          'The Service is primarily intended for adults. Users under 16 should use the Service only with consent from a parent or guardian.',
        ],
      },
      {
        title: '8. Policy Changes',
        paragraphs: [
          'This policy may be updated when necessary. If important changes are made, we will notify users within the Service.',
        ],
      },
      {
        title: '9. Contact',
        paragraphs: [
          'For privacy-related inquiries, please use the contact function available in the settings screen of the Service.',
        ],
      },
    ],
  },
  zh: {
    heading: '隐私政策',
    updatedAtLabel: '最后更新',
    updatedAt: '2026年4月14日',
    sections: [
      {
        title: '1. 我们收集的信息',
        lead: '本服务会收集以下信息：',
        bulletItems: [
          '账号信息：邮箱地址、昵称、认证信息（含 Google 登录）',
          '资料信息：当前人生阶段、预产期、计划怀孕时间',
          '使用数据：清单完成状态、自定义任务内容',
          '技术信息：IP 地址、浏览器类型、访问时间（作为日志自动收集）',
        ],
      },
      {
        title: '2. 信息使用目的',
        lead: '收集的信息用于以下目的：',
        bulletItems: [
          '提供、运营与改进本服务',
          '响应用户支持请求',
          '提供任务自动排期功能',
          '提供家庭组内数据共享功能',
          '分析使用情况并持续优化服务',
        ],
      },
      {
        title: '3. 信息共享',
        bulletItems: [
          '家庭组共享：同一家庭组成员之间会共享清单进度与任务信息。',
          '第三方提供：除法律法规要求外，未经用户同意不会向第三方提供个人信息。',
          '外部服务：我们使用 Supabase（美国）作为认证基础设施。',
        ],
      },
      {
        title: '4. 数据存储',
        bulletItems: [
          '数据通过加密连接存储于 Supabase（云数据库）。',
          '采用行级安全策略（RLS），确保无法访问其他家庭组数据。',
          '密码以哈希形式保存，不会明文存储。',
        ],
      },
      {
        title: '5. 用户权利',
        lead: '用户享有以下权利：',
        bulletItems: [
          '访问权：查看本人数据内容的权利',
          '更正权：可在设置页面随时修改资料信息',
          '删除权：通过删除账号删除关联数据',
          '数据可携权：后续计划提供数据导出功能',
        ],
      },
      {
        title: '6. Cookie 使用',
        paragraphs: [
          '本服务使用 Cookie 维持认证会话。这些 Cookie 为保证服务正常运行所必需，不用于广告追踪目的。',
        ],
      },
      {
        title: '7. 未成年人使用',
        paragraphs: [
          '本服务主要面向成年人。16 岁以下用户请在监护人同意下使用本服务。',
        ],
      },
      {
        title: '8. 政策变更',
        paragraphs: [
          '本政策可能根据需要更新。如有重要变更，我们将在服务内进行通知。',
        ],
      },
      {
        title: '9. 联系我们',
        paragraphs: [
          '如有隐私相关咨询，请通过本服务设置页面中的咨询功能联系我们。',
        ],
      },
    ],
  },
};
