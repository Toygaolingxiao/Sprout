import type { LegalLocale } from '@/lib/legal-copy';

export interface TokushoField {
  label: string;
  value: string;
}

export interface TokushoCopy {
  heading: string;
  updatedAtLabel: string;
  updatedAt: string;
  intro: string;
  salesOn: string;
  salesOff: string;
  missing: string;
  priceMissing: string;
  payment: string;
  delivery: string;
  returns: string;
  environment: string;
  labels: {
    seller: string;
    operator: string;
    address: string;
    phone: string;
    email: string;
    price: string;
    payment: string;
    delivery: string;
    returns: string;
    environment: string;
  };
}

const copy: Record<LegalLocale, TokushoCopy> = {
  ja: {
    heading: '特定商取引法に基づく表記',
    updatedAtLabel: '最終更新日',
    updatedAt: '2026年10月13日',
    intro: '特定商取引法に基づき、有料機能に関する表示です。販売事業者の氏名・住所・電話番号は、有料販売を行う時点でこのページに掲載します。',
    salesOn: '現在、有料プラン（Sprout Pro）を販売しています。',
    salesOff: '現在、有料プランは販売していません。',
    missing: '未掲載',
    priceMissing: '有料販売の開始時に掲載します。',
    payment: 'クレジットカード（Stripe）。代金は申込み時に決済されます。',
    delivery: '決済完了後、直ちにアプリ内の Pro 機能を利用できます。',
    returns: 'デジタル役務の提供開始後の返品は、法令上必要な場合を除き受け付けません。継続課金は、次回更新日の前日までにアプリ内から解約できます。',
    environment: '最新版の Chrome、Safari、Edge、またはそれらに準ずるブラウザ。',
    labels: {
      seller: '販売業者',
      operator: '運営統括責任者',
      address: '所在地',
      phone: '電話番号',
      email: 'メールアドレス',
      price: '販売価格',
      payment: '支払時期・方法',
      delivery: '役務の提供時期',
      returns: '返品・キャンセル',
      environment: '動作環境',
    },
  },
  zh: {
    heading: '基于特定商业交易法的标示',
    updatedAtLabel: '最后更新',
    updatedAt: '2026年10月13日',
    intro: '本页根据日本《特定商业交易法》说明付费功能。开始收费时，会在本页公布销售者的姓名、地址和电话。',
    salesOn: '目前正在销售付费方案（Sprout Pro）。',
    salesOff: '目前不销售付费方案。',
    missing: '未公布',
    priceMissing: '开始收费时公布。',
    payment: '信用卡（Stripe）。费用在申请时结算。',
    delivery: '支付完成后，可立即使用应用内的 Pro 功能。',
    returns: '数字服务开始提供后，除法律要求外不接受退货。持续订阅可在下次续费日前于应用内取消。',
    environment: '最新版 Chrome、Safari、Edge 或同等浏览器。',
    labels: {
      seller: '销售者',
      operator: '运营负责人',
      address: '地址',
      phone: '电话',
      email: '电子邮箱',
      price: '价格',
      payment: '支付时间与方式',
      delivery: '服务提供时间',
      returns: '退货与取消',
      environment: '运行环境',
    },
  },
  en: {
    heading: 'Specified Commercial Transactions',
    updatedAtLabel: 'Last updated',
    updatedAt: 'October 13, 2026',
    intro: 'This page discloses paid features under the Act on Specified Commercial Transactions. The seller name, address, and phone number are published here before paid sales begin.',
    salesOn: 'Sprout Pro is currently offered for sale.',
    salesOff: 'Paid plans are not currently offered for sale.',
    missing: 'Not published',
    priceMissing: 'Published when paid sales begin.',
    payment: 'Credit card via Stripe. Payment is taken when you subscribe.',
    delivery: 'Pro features become available in the app immediately after payment.',
    returns: 'After delivery of this digital service, returns are accepted only where required by law. A subscription can be canceled in the app before the next renewal date.',
    environment: 'A current version of Chrome, Safari, Edge, or an equivalent browser.',
    labels: {
      seller: 'Seller',
      operator: 'Person responsible',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      price: 'Price',
      payment: 'Payment',
      delivery: 'Delivery',
      returns: 'Returns and cancellation',
      environment: 'Environment',
    },
  },
};

function published(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function getTokushoDocument(locale: LegalLocale, billingEnabled: boolean) {
  const text = copy[locale];
  const fields: TokushoField[] = [
    { label: text.labels.seller, value: published(process.env.LEGAL_SELLER_NAME, text.missing) },
    { label: text.labels.operator, value: published(process.env.LEGAL_OPERATOR_NAME, text.missing) },
    { label: text.labels.address, value: published(process.env.LEGAL_ADDRESS, text.missing) },
    { label: text.labels.phone, value: published(process.env.LEGAL_PHONE, text.missing) },
    { label: text.labels.email, value: published(process.env.LEGAL_EMAIL, text.missing) },
    { label: text.labels.price, value: published(process.env.LEGAL_PRICE_TEXT, text.priceMissing) },
    { label: text.labels.payment, value: text.payment },
    { label: text.labels.delivery, value: text.delivery },
    { label: text.labels.returns, value: text.returns },
    { label: text.labels.environment, value: text.environment },
  ];

  return {
    ...text,
    salesStatus: billingEnabled ? text.salesOn : text.salesOff,
    fields,
  };
}
