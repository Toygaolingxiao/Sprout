import type { LifeStage, CategoryId, TargetGender } from '@/types';

export interface TemplateItem {
  stage_id: LifeStage;
  category_id: CategoryId;
  title: string;
  description?: string;
  tips?: string;
  target_gender: TargetGender;
  sort_order: number;
}

export const CHECKLIST_TEMPLATES: TemplateItem[] = [
  // ════════════════════════════════════════════════
  // 🌱 妊活（prenatal_care）
  // ════════════════════════════════════════════════

  // ── 健康 ──
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'female',
    title: '基礎体温の記録を開始する',
    description: '毎朝起床時に婦人体温計で基礎体温を測定し記録する',
    tips: '・口の中（舌の下）で計測し、毎日同じ時間に測る\n・基礎体温表やアプリで3ヶ月以上記録すると排卵パターンが見えてくる\n・低温期と高温期の二相性があれば排卵している可能性が高い\n・体温が上がらない場合は無排卵の可能性があるので受診を',
    sort_order: 1,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'female',
    title: '葉酸サプリを飲み始める',
    description: '妊娠1ヶ月前から400μg/日の摂取を推奨（厚生労働省）',
    tips: '・神経管閉鎖障害（二分脊椎など）のリスクを70%低減\n・食品だけでは不足しがちなのでサプリメントが効果的\n・妊娠3ヶ月まで継続するのが理想\n・鉄分・ビタミンB12が一緒に摂れるサプリがおすすめ',
    sort_order: 2,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'both',
    title: 'ブライダルチェック（婚前健診）を受ける',
    description: '男女ともに妊活前の総合検査。産婦人科・泌尿器科で受診',
    tips: '【女性】産婦人科で子宮・卵巣の状態、ホルモン値、性感染症など総合検査（自費1〜3万円）\n・AMH検査（卵巣予備能）も合わせて受けると良い\n【男性】泌尿器科で精液検査、性感染症、ホルモン検査など（自費5,000〜1.5万円）\n・不妊の原因の約半数は男性側にある\n・結果に問題があっても早期発見・早期治療で妊娠の可能性を高められる',
    sort_order: 3,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'male',
    title: '精液検査を受ける',
    description: '泌尿器科または不妊クリニックで精子の状態を確認',
    tips: '・不妊の原因の約半数は男性側にある\n・精子の数、運動率、形態を調べる\n・2〜7日の禁欲期間後に採取\n・結果が悪くても生活習慣改善やサプリで改善する場合がある\n・費用は3,000〜5,000円程度',
    sort_order: 4,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'both',
    title: '風疹抗体検査を受ける',
    description: '妊娠初期の風疹感染は先天性風疹症候群の原因になる',
    tips: '・特に1979〜1987年生まれの男性は接種歴がない可能性大\n・抗体価が低い場合はワクチン接種（女性は接種後2ヶ月間避妊が必要）\n・自治体の無料クーポンが使える場合あり\n・パートナーも一緒に検査するのが大切',
    sort_order: 5,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'female',
    title: '歯科検診を受ける',
    description: '妊娠中は歯科治療が制限されるため事前にケアを済ませる',
    tips: '・妊娠中はホルモンの影響で歯周病が悪化しやすい\n・歯周病は早産・低体重児出産のリスクを高める\n・虫歯治療、歯石除去、親知らずの対処を妊娠前に\n・妊娠中はX線撮影を避けたいため事前に完了させる',
    sort_order: 6,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'male',
    title: '歯科検診を受ける',
    description: '赤ちゃんへの虫歯菌の感染予防のため父親もケアを',
    tips: '・虫歯菌（ミュータンス菌）は親から子へ唾液を通じて感染\n・出産前に虫歯治療と歯周病ケアを完了させる\n・口腔内の菌の量を減らすことが赤ちゃんの虫歯予防に直結',
    sort_order: 7,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'both',
    title: '生活習慣を見直す（禁煙・節酒）',
    description: '喫煙・過度な飲酒は男女ともに妊娠力を低下させる',
    tips: '・喫煙は卵子の質低下、精子の数・運動率の低下に直結\n・受動喫煙も同様に有害\n・アルコールは女性は完全に控えるのが理想、男性も適量に\n・カフェインは1日200mg（コーヒー2杯）以下に',
    sort_order: 8,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'male',
    title: '精子の質を高める生活習慣を実践する',
    description: '食事・運動・睡眠で精子の質を改善',
    tips: '・亜鉛を多く含む食品を摂る（牡蠣、牛肉、ナッツ類）\n・長時間の座りっぱなしやサウナ、熱い風呂は精子に悪影響\n・ブリーフよりトランクスの方が温度調節に良い\n・適度な運動は精子の質を向上させるが、過度な運動は逆効果\n・スマホをズボンのポケットに入れない',
    sort_order: 9,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'female',
    title: '適正体重を目指す',
    description: 'BMI 18.5〜25が理想。痩せすぎも太りすぎもリスクに',
    tips: '・痩せすぎ（BMI<18.5）は排卵障害や低体重児出産のリスク\n・太りすぎ（BMI>25）は排卵障害、妊娠糖尿病、妊娠高血圧のリスク\n・急激なダイエットはホルモンバランスを崩すので緩やかに\n・バランスの良い食事と適度な運動を心がける',
    sort_order: 10,
  },
  {
    stage_id: 'prenatal_care', category_id: 'health', target_gender: 'both',
    title: '性感染症（STI）検査を受ける',
    description: 'クラミジア、淋菌等は不妊・流産のリスクに',
    tips: '・クラミジアは自覚症状がないまま卵管を傷つけることがある\n・男性も無症状のことが多いのでカップルで検査を\n・早期発見すれば抗生物質で治療可能\n・HIVやB型肝炎の検査も妊娠前に確認しておくと安心',
    sort_order: 11,
  },

  // ── お金 ──
  {
    stage_id: 'prenatal_care', category_id: 'money', target_gender: 'both',
    title: '不妊治療の費用と助成金を調べる',
    description: '2022年4月から不妊治療が保険適用に（条件あり）',
    tips: '・人工授精：1回約5,000〜3万円\n・体外受精：1回約20〜60万円\n・保険適用は年齢・回数に制限あり（女性43歳未満など）\n・自治体独自の上乗せ助成もあるので確認を\n・確定申告の医療費控除も忘れずに',
    sort_order: 12,
  },
  {
    stage_id: 'prenatal_care', category_id: 'money', target_gender: 'both',
    title: '医療保険の確認・加入検討',
    description: '妊娠後は加入制限がかかる保険が多い',
    tips: '・妊娠前に女性特約のある医療保険に加入しておくと安心\n・帝王切開は約20%の人が経験し、保険適用＋医療保険が使える\n・既に加入済みの場合は保障内容を確認\n・妊娠が分かってからの加入は条件付きになることが多い',
    sort_order: 13,
  },
  {
    stage_id: 'prenatal_care', category_id: 'money', target_gender: 'both',
    title: '出産〜育児にかかる費用の概算を立てる',
    description: '出産費用、育児用品、教育費など将来の見通しを',
    tips: '・出産費用：平均約50万円（出産育児一時金で大部分をカバー）\n・育児用品（初期）：約10〜20万円\n・月々のミルク・オムツ代：約1〜2万円\n・将来の教育費：幼稚園〜大学で約1,000〜2,500万円\n・家計のシミュレーションをしておくと安心',
    sort_order: 14,
  },

  // ── その他 ──
  {
    stage_id: 'prenatal_care', category_id: 'other', target_gender: 'both',
    title: '妊活についてパートナーと話し合う',
    description: '妊活の方針、スケジュール感、不安な点を共有',
    tips: '・いつ頃までに授かりたいか、治療はどこまでするか等を話し合う\n・お互いのプレッシャーや不安を聞く時間を作る\n・妊活は二人の問題。どちらかだけに負担を偏らせない\n・うまくいかない時期の対処法も事前に話しておく',
    sort_order: 15,
  },
  {
    stage_id: 'prenatal_care', category_id: 'other', target_gender: 'female',
    title: '仕事との両立プランを考える',
    description: '妊娠中・産後の働き方をイメージしておく',
    tips: '・職場の産休・育休制度を確認\n・通院で必要な休みが取りやすい環境か確認\n・不妊治療と仕事の両立支援制度がある企業も\n・上司への相談タイミングも考えておく',
    sort_order: 16,
  },
  {
    stage_id: 'prenatal_care', category_id: 'other', target_gender: 'male',
    title: '育休取得について調べる',
    description: '男性の育休制度（産後パパ育休含む）を確認',
    tips: '・2022年10月から「産後パパ育休」制度開始（出生後8週間以内に4週間まで）\n・通常の育児休業と合わせて最大4回に分割取得可能\n・育児休業給付金は賃金の67%（180日以降50%）\n・取得率は上昇中だが、早めに上司に相談して業務引継ぎ準備を',
    sort_order: 17,
  },

  // ════════════════════════════════════════════════
  // 🤰 妊娠（pregnancy）
  // ════════════════════════════════════════════════

  // ── 手続き ──
  {
    stage_id: 'pregnancy', category_id: 'procedure', target_gender: 'female',
    title: '妊娠届出書を提出し母子手帳を受け取る',
    description: '市区町村の窓口に提出。妊婦健診の補助券ももらえる',
    tips: '・医療機関で妊娠の確認後（6〜10週頃）に届出\n・届出と同時に母子手帳と妊婦健診14回分の補助券がもらえる\n・自治体によって追加のサービス（面談、助産師相談など）がある\n・マイナンバーカードがあると手続きがスムーズ',
    sort_order: 1,
  },
  {
    stage_id: 'pregnancy', category_id: 'procedure', target_gender: 'both',
    title: '出産する病院を決める',
    description: '分娩予約は早めに。人気の病院は妊娠初期に埋まる',
    tips: '・総合病院：ハイリスク対応可、NICUあり\n・個人クリニック：アットホーム、待ち時間短め\n・助産院：自然分娩希望の方、医療介入が少ない\n・無痛分娩希望の場合は対応病院を選ぶ（施設が限られる）\n・自宅からの距離、費用、出産スタイルを考慮して選ぶ',
    sort_order: 2,
  },
  {
    stage_id: 'pregnancy', category_id: 'procedure', target_gender: 'female',
    title: '職場への妊娠報告・産休手続き',
    description: '安定期（16週頃）に入ったら上司に報告',
    tips: '・報告のタイミングは体調や職種に応じて柔軟に\n・つわりがひどい場合は早めに相談してOK\n・「母性健康管理指導事項連絡カード」を使えば時差通勤や休憩の措置を受けられる\n・産前6週間（多胎14週間）から産休取得可能\n・業務引き継ぎリストを早めに作成',
    sort_order: 3,
  },
  {
    stage_id: 'pregnancy', category_id: 'procedure', target_gender: 'male',
    title: '職場に「父親になる」ことを報告する',
    description: '育休取得予定があれば早めに上司に相談',
    tips: '・育休取得の1ヶ月前までに申請が必要（産後パパ育休は2週間前）\n・業務の引き継ぎ計画を立てておくとスムーズ\n・出産前後の有給取得計画も立てておく\n・立ち会い出産を希望する場合は備えを',
    sort_order: 4,
  },

  // ── 健康 ──
  {
    stage_id: 'pregnancy', category_id: 'health', target_gender: 'female',
    title: '妊婦健診を定期的に受ける',
    description: '初期は月1回、中期は2週に1回、後期は週1回',
    tips: '・計14回程度の健診が推奨（補助券を活用）\n・超音波検査で赤ちゃんの成長を確認\n・血液検査、尿検査で母体の状態をチェック\n・気になる症状は健診以外でも遠慮なく相談\n・パートナーも一緒に受診できる機会を作ると◎',
    sort_order: 5,
  },
  {
    stage_id: 'pregnancy', category_id: 'health', target_gender: 'female',
    title: 'つわり対策を知る',
    description: '妊娠5〜16週頃がピーク。食事と生活の工夫で乗り切る',
    tips: '・空腹を避ける（少量頻回の食事、枕元にクラッカー等）\n・冷たいもの・酸味のあるものが食べやすいことが多い\n・水分補給を忘れずに（脱水は危険）\n・嘔吐が激しく体重減少5%以上なら「妊娠悪阻」の可能性→受診を\n・つわりは赤ちゃんが元気な証拠と前向きに',
    sort_order: 6,
  },
  {
    stage_id: 'pregnancy', category_id: 'health', target_gender: 'male',
    title: 'パートナーのつわりをサポートする',
    description: '食事の準備、家事の負担軽減、精神的な支え',
    tips: '・匂いに敏感になるので強い香りの食事は避ける\n・家事（料理・掃除・洗濯）を積極的に分担する\n・「大丈夫？」と声をかけるだけでも救いになる\n・体調が悪い時は無理をさせない\n・つわりのつらさを理解し共感する姿勢が大切',
    sort_order: 7,
  },
  {
    stage_id: 'pregnancy', category_id: 'health', target_gender: 'female',
    title: '妊娠中に避けるべき食品を確認する',
    description: '生肉、生魚、アルコール、カフェインなどに注意',
    tips: '・生肉・生ハム：トキソプラズマ感染リスク\n・刺身の一部：水銀のリスク（マグロは週に1回程度まで）\n・ナチュラルチーズ（加熱不十分）：リステリア菌リスク\n・アルコール：胎児性アルコール症候群の原因（少量でもNG）\n・カフェイン：1日200mg以下に制限',
    sort_order: 8,
  },
  {
    stage_id: 'pregnancy', category_id: 'health', target_gender: 'female',
    title: '妊娠糖尿病・妊娠高血圧症候群について知る',
    description: '早期発見が母子の安全に重要',
    tips: '・妊娠糖尿病：妊婦の約10%が発症。食事療法が基本\n・妊娠高血圧症候群：血圧140/90以上やタンパク尿。重症化すると危険\n・いずれも健診で早期発見可能\n・塩分控えめ、バランスの良い食事、適度な運動で予防\n・肥満・高齢出産はリスク因子',
    sort_order: 9,
  },
  {
    stage_id: 'pregnancy', category_id: 'health', target_gender: 'female',
    title: '適度な運動を続ける',
    description: 'マタニティヨガ、ウォーキングなど医師と相談の上で',
    tips: '・安定期に入ったら適度な運動は推奨（医師に確認）\n・ウォーキング、マタニティヨガ、スイミングがおすすめ\n・お腹を圧迫する運動や転倒リスクの高い運動は避ける\n・腰痛予防にもなり、出産時の体力づくりにも効果的\n・お腹が張ったら休む',
    sort_order: 10,
  },
  {
    stage_id: 'pregnancy', category_id: 'health', target_gender: 'both',
    title: '両親学級・母親学級に参加する',
    description: '出産・育児の基礎知識、沐浴練習、呼吸法など',
    tips: '・自治体主催（無料）と病院主催がある\n・パートナーと一緒に参加できるクラスを選ぶ\n・沐浴、おむつ替え、抱っこの実習がある\n・出産時の呼吸法やリラックス法を学べる\n・他の妊婦さん・パパとの交流の場にもなる',
    sort_order: 11,
  },
  {
    stage_id: 'pregnancy', category_id: 'health', target_gender: 'female',
    title: 'マタニティ歯科健診を受ける',
    description: '妊娠中の歯周病は早産リスクに。自治体の無料健診を活用',
    tips: '・妊娠中はホルモン変化で歯肉炎になりやすい\n・多くの自治体で妊婦歯科健診が無料\n・妊娠中期（5〜7ヶ月）が治療に最適な時期\n・つわりで歯磨きがつらい時は小さめの歯ブラシやうがいで対応',
    sort_order: 12,
  },
  {
    stage_id: 'pregnancy', category_id: 'health', target_gender: 'male',
    title: '妊娠・出産の知識を身につける',
    description: '本やアプリで妊娠の経過、出産の流れを学ぶ',
    tips: '・妊娠週数ごとの赤ちゃんの成長と母体の変化を知る\n・陣痛〜出産の流れを事前に理解しておく\n・パパ向けの妊娠・出産本が多数ある\n・妊娠アプリを一緒に入れて情報を共有するのも効果的\n・知識があると不安が減り、サポートの質も上がる',
    sort_order: 13,
  },

  // ── お金 ──
  {
    stage_id: 'pregnancy', category_id: 'money', target_gender: 'both',
    title: '出産育児一時金を確認する',
    description: '健康保険から50万円が支給される（2023年4月〜）',
    tips: '・直接支払制度を利用すれば病院窓口での支払いが軽減\n・差額が出た場合は後日申請で受け取れる\n・国保・社保どちらでも受給可能\n・双子以上の場合は人数分もらえる\n・産科医療補償制度の対象外施設は48.8万円',
    sort_order: 14,
  },
  {
    stage_id: 'pregnancy', category_id: 'money', target_gender: 'female',
    title: '出産手当金を確認する',
    description: '健康保険（社保）加入者が産休中に受給可能',
    tips: '・支給額：標準報酬日額の2/3×産前42日+産後56日\n・国民健康保険には出産手当金はない\n・退職後でも条件を満たせば受給可能な場合あり\n・申請は産後に勤務先経由で行う',
    sort_order: 15,
  },
  {
    stage_id: 'pregnancy', category_id: 'money', target_gender: 'both',
    title: '高額療養費制度を確認する',
    description: '帝王切開や切迫早産の入院費が高額になった場合に利用',
    tips: '・月の医療費自己負担が上限を超えた分が返金される\n・限度額適用認定証を事前に取得しておくと窓口負担が軽減\n・帝王切開は保険適用のため対象になる\n・入院が月をまたぐと2ヶ月分に分かれるので注意',
    sort_order: 16,
  },
  {
    stage_id: 'pregnancy', category_id: 'money', target_gender: 'both',
    title: '医療費控除の対象をメモする',
    description: '妊婦健診、出産費用、通院交通費などが医療費控除の対象',
    tips: '・年間の医療費が10万円を超えた分を所得控除できる\n・不妊治療費、妊婦健診費、出産費用、入院費が対象\n・タクシー代は緊急時のみ対象（電車・バス代は対象）\n・領収書は捨てずに保管を\n・確定申告（翌年2〜3月）で還付申告',
    sort_order: 17,
  },

  // ── 買い物 ──
  {
    stage_id: 'pregnancy', category_id: 'shopping', target_gender: 'female',
    title: 'マタニティウェアを準備する',
    description: 'お腹が目立ち始める5ヶ月頃から必要に',
    tips: '・マタニティパンツ、ワンピースは着回ししやすい\n・授乳兼用のブラジャーを選ぶと産後も使える\n・腹帯（妊婦帯）はお腹の支えと冷え防止に\n・靴は安定感のあるローヒールに切り替え\n・冬場はお腹まで覆えるレギンスが便利',
    sort_order: 18,
  },
  {
    stage_id: 'pregnancy', category_id: 'shopping', target_gender: 'both',
    title: 'ベビー用品の準備リストを作る',
    description: 'チャイルドシート、ベビーベッド、衣類など大物は早めに',
    tips: '・最低限必要なもの：肌着5〜6枚、おむつ、おしりふき、ガーゼ\n・チャイルドシートは退院時に必要なので早めに（車使用の場合）\n・ベビーベッドはレンタルも選択肢\n・先輩ママからのお下がりも活用\n・全部揃えると10〜20万円。優先順位をつけて',
    sort_order: 19,
  },
  {
    stage_id: 'pregnancy', category_id: 'shopping', target_gender: 'female',
    title: '入院準備バッグを用意する',
    description: '36週までに準備。陣痛時にすぐ持ち出せるように',
    tips: '・母子手帳、健康保険証、診察券は必須\n・パジャマ（前開き）、産褥ショーツ、授乳ブラ\n・スリッパ、洗面用具、充電器\n・お産パッドは病院で用意されることも多い（事前確認）\n・退院時の赤ちゃんの衣類（肌着＋ドレスオール）も忘れずに',
    sort_order: 20,
  },

  // ── その他 ──
  {
    stage_id: 'pregnancy', category_id: 'other', target_gender: 'both',
    title: '赤ちゃんの名前を考える',
    description: '出生届の期限は生後14日以内。じっくり検討を',
    tips: '・使用可能な文字：常用漢字、人名用漢字、ひらがな、カタカナ\n・読み方の制限はないが、将来子どもが困らない名前を\n・画数、響き、意味、名字とのバランスを考慮\n・出生届に記入する前に戸籍での使用可否を確認\n・パートナーと一緒に候補リストを作るのがおすすめ',
    sort_order: 21,
  },
  {
    stage_id: 'pregnancy', category_id: 'other', target_gender: 'both',
    title: '出産時の連絡先リストを作る',
    description: '陣痛が来た時にすぐ連絡できるよう準備',
    tips: '・病院の電話番号（夜間・休日対応）\n・タクシー会社（陣痛タクシーに登録しておくと安心）\n・両方の実家の連絡先\n・職場の連絡先\n・パートナーの不在時の対応プランも考えておく',
    sort_order: 22,
  },
  {
    stage_id: 'pregnancy', category_id: 'other', target_gender: 'male',
    title: '出産立ち会いの準備をする',
    description: '立ち会い出産を希望する場合の準備と心構え',
    tips: '・病院の立ち会いルールを確認（コロナ禍以降は制限がある場合も）\n・出産の流れ（陣痛〜分娩）を理解しておく\n・パートナーの腰をさする、水分補給を手伝うなどサポート方法を学ぶ\n・出産は長時間になることも。自分の食事・飲み物も用意\n・感動の瞬間をカメラに残すかどうかも事前に相談',
    sort_order: 23,
  },
  {
    stage_id: 'pregnancy', category_id: 'other', target_gender: 'both',
    title: '産後の生活をイメージして準備する',
    description: '家事分担、サポート体制、食事の備蓄など',
    tips: '・産後は母体の回復が最優先。家事は最小限に\n・冷凍食品やレトルトの備蓄\n・家事代行やネットスーパーの登録\n・実家のサポートを受けられるか確認\n・産後ヘルパーや自治体の支援サービスも調べておく',
    sort_order: 24,
  },

  // ════════════════════════════════════════════════
  // 👶 産後（postpartum）
  // ════════════════════════════════════════════════

  // ── 手続き ──
  {
    stage_id: 'postpartum', category_id: 'procedure', target_gender: 'both',
    title: '出生届を提出する',
    description: '生後14日以内に市区町村の窓口へ提出',
    tips: '・届出先は本籍地、出生地、届出人の住所地のいずれか\n・届出人は父または母\n・出生証明書（病院で記入済み）を添付\n・届出時に住民票登録、マイナンバー通知、児童手当の案内がある\n・名前が決まっていない場合は「追完届」で後日届出可能だが極力避ける',
    sort_order: 1,
  },
  {
    stage_id: 'postpartum', category_id: 'procedure', target_gender: 'both',
    title: '赤ちゃんを健康保険に加入させる',
    description: '出生後すぐに親の健康保険に加入手続き',
    tips: '・社会保険：勤務先に「被扶養者（異動）届」を提出\n・国民健康保険：市区町村の窓口で手続き\n・保険証ができるまでは全額自費（後日精算可）\n・パートナーの収入が多い方の扶養に入れるのが一般的\n・1ヶ月健診までに保険証を入手しておくのが理想',
    sort_order: 2,
  },
  {
    stage_id: 'postpartum', category_id: 'procedure', target_gender: 'both',
    title: '乳幼児医療費助成（マル乳）の申請',
    description: '自治体により助成内容が異なる。出生後すぐに申請',
    tips: '・多くの自治体で中学卒業（または高校卒業）まで医療費無料または一部負担\n・赤ちゃんの健康保険証が必要\n・申請が遅いとさかのぼれないので出生後速やかに\n・転入時にも別途手続きが必要',
    sort_order: 3,
  },

  // ── お金 ──
  {
    stage_id: 'postpartum', category_id: 'money', target_gender: 'both',
    title: '児童手当を申請する',
    description: '出生翌日から15日以内に申請。遡及できないので注意',
    tips: '・支給額（2024年10月〜）：0〜3歳未満 月15,000円、3歳〜月10,000円\n・所得制限なし（2024年10月〜改正）\n・第3子以降は月30,000円に増額\n・申請が遅れると受け取れない月が発生するので注意\n・振込先は申請者名義の口座',
    sort_order: 4,
  },
  {
    stage_id: 'postpartum', category_id: 'money', target_gender: 'both',
    title: '出産育児一時金の差額を申請する',
    description: '出産費用が50万円未満の場合、差額が受け取れる',
    tips: '・直接支払制度利用で出産費用が一時金より安い場合に差額を請求\n・健康保険組合に申請書を提出\n・申請期限は出産日の翌日から2年以内\n・必要書類：出産費用の明細書、申請書',
    sort_order: 5,
  },
  {
    stage_id: 'postpartum', category_id: 'money', target_gender: 'female',
    title: '育児休業給付金の申請準備',
    description: '勤務先のハローワークを通じて申請',
    tips: '・支給額：最初の180日は賃金の67%、以降は50%\n・初回申請は育休開始4ヶ月以内に事業主経由で\n・2ヶ月ごとに追加申請が必要\n・雇用保険に加入していることが条件\n・パパ・ママ育休プラスで期間延長も可能',
    sort_order: 6,
  },
  {
    stage_id: 'postpartum', category_id: 'money', target_gender: 'male',
    title: '育児休業給付金の申請（男性）',
    description: '男性も育休取得で給付金を受給できる',
    tips: '・産後パパ育休（出生後8週以内4週間）の給付金は賃金の67%\n・通常の育休と合わせて受給可能\n・男性の育休取得は家計にもプラス（社会保険料免除もあり）\n・取得日数が短くても給付金の対象になる',
    sort_order: 7,
  },
  {
    stage_id: 'postpartum', category_id: 'money', target_gender: 'both',
    title: '確定申告（医療費控除）の準備',
    description: '出産年の医療費をまとめて翌年に確定申告',
    tips: '・妊婦健診＋出産費用で10万円を超えることが多い\n・出産育児一時金を受け取った分は差し引く\n・タクシー代（緊急時）、入院時の食事代も一部対象\n・e-Taxで電子申告すると楽\n・医療費通知や領収書を保管しておく',
    sort_order: 8,
  },

  // ── 健康 ──
  {
    stage_id: 'postpartum', category_id: 'health', target_gender: 'female',
    title: '産後1ヶ月健診を受ける',
    description: '母体の回復状況と赤ちゃんの成長を確認',
    tips: '・子宮の回復、悪露の状態、傷の治り具合を確認\n・赤ちゃんの体重増加（1日30g前後が目安）、黄疸のチェック\n・授乳の相談もできる\n・産後うつの兆候がないかもチェック\n・気になることはリストにしてメモして持参',
    sort_order: 9,
  },
  {
    stage_id: 'postpartum', category_id: 'health', target_gender: 'female',
    title: '産後の体の回復に専念する',
    description: '産褥期（産後6〜8週間）は休養が最優先',
    tips: '・「床上げ」は昔から産後3週間を目安\n・骨盤が不安定なので重い物を持たない\n・悪露は4〜6週間で徐々に治まる。異常な出血は受診を\n・無理な家事は体の回復を遅らせる\n・「赤ちゃんが寝ているときに一緒に寝る」が鉄則',
    sort_order: 10,
  },
  {
    stage_id: 'postpartum', category_id: 'health', target_gender: 'female',
    title: '授乳・ミルクのスタイルを確立する',
    description: '母乳・混合・完全ミルク、自分に合ったスタイルで',
    tips: '・母乳のメリット：免疫物質、経済的、子宮の回復促進\n・ミルクのメリット：パートナーも授乳参加可能、外出が楽\n・混合は両方のいいとこ取り\n・母乳が出にくくても自分を責めない。どの方法でも赤ちゃんは育つ\n・乳腺炎の兆候（しこり、発熱）があれば早めに受診',
    sort_order: 11,
  },
  {
    stage_id: 'postpartum', category_id: 'health', target_gender: 'both',
    title: '産後うつのサインを知る',
    description: '産後10〜15%の母親が経験。パートナーの気づきが重要',
    tips: '・症状：強い不安感、涙が止まらない、赤ちゃんへの無関心、不眠\n・マタニティブルーズ（産後3〜5日）とは別物（2週間以上続く場合は要注意）\n・パートナーは「最近どう？」と定期的に声をかける\n・「よりそいホットライン」や産後ケアセンターに相談\n・専門的な治療で回復するので早めの受診が大切',
    sort_order: 12,
  },
  {
    stage_id: 'postpartum', category_id: 'health', target_gender: 'male',
    title: '「パタニティブルー」に気をつける',
    description: '父親にも産後うつ（約10%）が起こることがある',
    tips: '・原因：睡眠不足、経済的プレッシャー、生活の激変\n・症状：イライラ、無気力、集中力低下、パートナーとの関係悪化\n・「男なのに弱音を吐くな」と我慢しない\n・趣味や友人との交流で気分転換を\n・つらい時は我慢せずメンタルヘルスの専門家に相談',
    sort_order: 13,
  },
  {
    stage_id: 'postpartum', category_id: 'health', target_gender: 'female',
    title: '産後ケア施設の利用を検討する',
    description: '自治体の産後ケア事業で宿泊型・通所型・訪問型がある',
    tips: '・助産師による母乳指導、授乳サポートが受けられる\n・宿泊型は赤ちゃんを預けて休める施設も\n・自治体の助成で自己負担が軽減される場合が多い\n・初産で周囲にサポートが少ない場合は特におすすめ\n・産前から情報収集・予約しておくと安心',
    sort_order: 14,
  },
  {
    stage_id: 'postpartum', category_id: 'health', target_gender: 'male',
    title: '夜間対応を積極的に分担する',
    description: '夜間授乳やおむつ替えを交代で行う',
    tips: '・ミルクの場合は夜間授乳を交代できる\n・母乳の場合もげっぷ出しやおむつ替えを担当\n・「シフト制」で前半/後半を分担する方法が効果的\n・パートナーの睡眠時間を確保することが最優先\n・睡眠不足は判断力低下・事故のリスクに直結',
    sort_order: 15,
  },

  // ── その他 ──
  {
    stage_id: 'postpartum', category_id: 'other', target_gender: 'both',
    title: '内祝い（お返し）の準備',
    description: '出産祝いをいただいた方へのお返し（生後1ヶ月頃）',
    tips: '・金額の目安はいただいた額の1/2〜1/3\n・お宮参りの時期（生後1ヶ月前後）に贈るのが一般的\n・のし紙は「内祝」で赤ちゃんの名前を書く\n・カタログギフトやお菓子が人気\n・メッセージカードを添えると丁寧',
    sort_order: 16,
  },
  {
    stage_id: 'postpartum', category_id: 'other', target_gender: 'both',
    title: 'お宮参りの準備',
    description: '生後1ヶ月頃に地元の神社に参拝する行事',
    tips: '・男の子は生後31日目、女の子は32日目が伝統的（厳密でなくてOK）\n・赤ちゃんの体調や天候を優先して日程を決める\n・初穂料は5,000〜10,000円が相場\n・記念写真を撮るならフォトスタジオの予約も\n・祖父母を招く場合のスケジュール調整',
    sort_order: 17,
  },
  {
    stage_id: 'postpartum', category_id: 'other', target_gender: 'both',
    title: '出生届に伴うその他の手続き',
    description: 'マイナンバー通知、パスポート申請、学資保険加入など',
    tips: '・マイナンバー通知書は出生届後に届く\n・パスポートは海外旅行予定がある場合に（赤ちゃんでも必要）\n・銀行口座の開設を検討（児童手当の貯蓄用など）\n・学資保険やジュニアNISAなどの資産形成も検討\n・生命保険の受取人変更も忘れずに',
    sort_order: 18,
  },

  // ════════════════════════════════════════════════
  // 🍼 育児（childcare）
  // ════════════════════════════════════════════════

  // ── 健康 ──
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'both',
    title: '予防接種スケジュールを管理する',
    description: '生後2ヶ月からスタート。スケジュール管理が重要',
    tips: '・生後2ヶ月：ヒブ、肺炎球菌、B型肝炎、ロタウイルス\n・生後3ヶ月：四種混合（DPT-IPV）追加\n・生後5ヶ月：BCG\n・1歳：MR（麻しん風しん）、水痘、おたふく\n・同時接種で通院回数を減らせる\n・母子手帳アプリでスケジュール管理が便利',
    sort_order: 1,
  },
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'both',
    title: '乳児健診を受ける（3〜4ヶ月健診）',
    description: '首すわり、体重増加、股関節脱臼のチェック',
    tips: '・市区町村の集団健診（無料）で実施\n・首のすわり具合、追視（目で追う）、あやし笑いの確認\n・股関節脱臼の早期発見が重要\n・体重増加が順調か（出生時の約2倍が目安）\n・気になる発達の相談もできる',
    sort_order: 2,
  },
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'both',
    title: '6〜7ヶ月健診を受ける',
    description: 'お座り、離乳食の進み具合を確認',
    tips: '・自費の場合が多い（自治体によっては無料券あり）\n・お座りの安定度、寝返り、ずりばいの確認\n・歯の生え始めの確認\n・離乳食の進め方について相談できる\n・貧血検査が行われることも',
    sort_order: 3,
  },
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'both',
    title: '離乳食を開始する（5〜6ヶ月頃）',
    description: '10倍がゆから始めて徐々に食材を増やす',
    tips: '・開始の目安：首がすわり、支えるとお座りできる、食べ物に興味を示す\n・最初は10倍がゆを小さじ1から\n・新しい食材は1日1種類ずつ、午前中に試す（アレルギー対応のため）\n・卵は固ゆでの卵黄から。小麦は少量ずつ\n・はちみつは1歳まで絶対NG（ボツリヌス症）',
    sort_order: 4,
  },
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'both',
    title: '1歳6ヶ月児健診を受ける',
    description: '歩行、言語発達、歯の状態などを確認',
    tips: '・自治体の集団健診（無料・義務）\n・ひとり歩きの確認、指差し、意味のある言葉（ママ・パパ等）\n・歯科検診とフッ素塗布\n・1歳半で歩かない、言葉が出ない場合は経過観察になることも\n・発達は個人差が大きいので過度に心配しすぎない',
    sort_order: 5,
  },
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'both',
    title: '3歳児健診を受ける',
    description: '視力、聴力、発達の総合チェック',
    tips: '・自治体の集団健診（無料・義務）\n・視力検査（弱視の早期発見が重要）\n・聴力検査、尿検査\n・二語文（「ワンワンいた」等）が出ているか\n・社会性の発達（他の子と遊べるか）の確認\n・知的発達や言語発達の遅れの早期発見が目的',
    sort_order: 6,
  },
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'both',
    title: 'かかりつけ小児科を決める',
    description: '自宅から近く、信頼できる小児科を見つける',
    tips: '・徒歩圏内または車で15分以内が理想\n・夜間・休日対応の二次救急病院も確認しておく\n・♯8000（小児救急電話相談）を登録しておく\n・予防接種に力を入れているクリニックがおすすめ\n・Webで予約できると便利',
    sort_order: 7,
  },
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'both',
    title: '赤ちゃんの安全対策（事故防止）',
    description: '窒息、転落、誤飲、やけどなどの予防対策',
    tips: '・うつぶせ寝は避ける（SIDS予防）。固めの布団、枕なし\n・柵付きベッドを使い、転落防止\n・直径3.9cm以下のものは誤飲の危険（トイレットペーパーの芯が目安）\n・コンセントカバー、角ガード、ゲートの設置\n・お風呂の残り湯は抜いておく（溺水事故防止）',
    sort_order: 8,
  },
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'female',
    title: '産後の体型回復に取り組む',
    description: '骨盤矯正、産後ヨガなどで少しずつ体を戻す',
    tips: '・産後1ヶ月健診で運動OKが出てから\n・骨盤ベルトや骨盤矯正で骨盤のゆがみをケア\n・産後ヨガ、ピラティスは子連れOKのスタジオも多い\n・過度なダイエットは母乳に影響するので注意\n・半年〜1年かけてゆっくり戻すのが理想',
    sort_order: 9,
  },
  {
    stage_id: 'childcare', category_id: 'health', target_gender: 'both',
    title: '歯磨き習慣を始める',
    description: '歯が生え始めたらガーゼ拭き→乳児用歯ブラシへ',
    tips: '・最初の歯が生えたら（生後6ヶ月頃〜）ケア開始\n・最初はガーゼや専用シートで歯の表面を拭く\n・歯ブラシに慣れたら仕上げ磨きを親が行う\n・フッ素入り歯磨き粉は米粒大から\n・仕上げ磨きは小学校低学年まで続けるのが理想',
    sort_order: 10,
  },

  // ── 手続き ──
  {
    stage_id: 'childcare', category_id: 'procedure', target_gender: 'both',
    title: '保育園・幼稚園・こども園を調べる',
    description: '保活は0歳児4月入園なら夏頃から動き始める',
    tips: '・認可保育園：自治体に申し込み。所得による保育料\n・認可外保育園：施設に直接申し込み。費用は施設による\n・幼稚園：3歳〜。教育重視。預かり保育ありの園も\n・認定こども園：保育と教育の両方\n・見学は複数園行って雰囲気や方針を比較',
    sort_order: 11,
  },
  {
    stage_id: 'childcare', category_id: 'procedure', target_gender: 'both',
    title: '保育園の申込をする',
    description: '認可保育園の4月入園は前年10〜11月頃が申込期限',
    tips: '・必要書類：就労証明書、保育の必要性の認定書類\n・希望園は複数記入（第5希望くらいまで）\n・点数制度を理解し、加点要素を確認\n・1次で不承諾でも2次募集がある\n・認可外も並行して申し込んでおくと安心',
    sort_order: 12,
  },
  {
    stage_id: 'childcare', category_id: 'procedure', target_gender: 'both',
    title: '復職の準備をする',
    description: '育休からの復帰に向けた準備',
    tips: '・復帰日の調整を勤務先と相談\n・保育園の慣らし保育期間（1〜2週間）を考慮\n・時短勤務制度の確認（3歳まで利用可）\n・急な呼び出し時の対応プランを夫婦で共有\n・病児保育やファミリーサポートに登録しておく',
    sort_order: 13,
  },
  {
    stage_id: 'childcare', category_id: 'procedure', target_gender: 'female',
    title: '卒乳・断乳の計画を立てる',
    description: '復職のタイミングや子どもの様子に合わせて',
    tips: '・WHO推奨は2歳頃まで。日本では1歳前後が多い\n・卒乳（自然に離れる）と断乳（意図的にやめる）がある\n・急にやめると乳腺炎のリスクがあるので徐々に\n・断乳は3日間が勝負。パートナーの協力が必須\n・寝かしつけの代替手段を先に確立しておく',
    sort_order: 14,
  },

  // ── お金 ──
  {
    stage_id: 'childcare', category_id: 'money', target_gender: 'both',
    title: '学資保険・教育資金の積立を始める',
    description: '早く始めるほど月々の負担が軽い',
    tips: '・学資保険：返戻率で選ぶ。17歳or18歳満期が多い\n・つみたてNISA：投資信託で長期運用\n・子ども名義の口座に児童手当を貯める方法もシンプル\n・大学入学時に約200万円が目安（国公立）\n・私立や一人暮らしなら400〜600万円',
    sort_order: 15,
  },
  {
    stage_id: 'childcare', category_id: 'money', target_gender: 'both',
    title: '幼児教育無償化の内容を確認する',
    description: '3〜5歳は月25,700円まで（認可外は37,000円まで）無償',
    tips: '・認可保育園・幼稚園・認定こども園が対象\n・幼稚園の預かり保育も対象（月11,300円まで）\n・0〜2歳は住民税非課税世帯のみ無償化\n・副食費（おかず代）は無償化の対象外\n・手続きは施設を通じて行う場合が多い',
    sort_order: 16,
  },

  // ── 買い物 ──
  {
    stage_id: 'childcare', category_id: 'shopping', target_gender: 'both',
    title: '月齢に合ったおもちゃ・絵本を用意する',
    description: '発達を促すおもちゃは月齢に合わせて選ぶ',
    tips: '・0〜3ヶ月：モビール、ガラガラ（白黒の高コントラスト）\n・3〜6ヶ月：握りやすいおもちゃ、歯がため\n・6〜12ヶ月：つみき、コップ重ね、仕掛け絵本\n・1歳〜：型はめパズル、お絵かき道具、ごっこ遊び\n・絵本は「いないいないばあ」「じゃあじゃあびりびり」等が定番',
    sort_order: 17,
  },
  {
    stage_id: 'childcare', category_id: 'shopping', target_gender: 'both',
    title: '成長に合わせた衣類のサイズアップ',
    description: '赤ちゃんの成長は早い。季節とサイズを考慮',
    tips: '・サイズ目安：新生児50cm→3ヶ月60cm→6ヶ月70cm→1歳80cm\n・ワンシーズンで着られなくなるので買いすぎ注意\n・フリマアプリやお下がりを活用するのがコスパ◎\n・つかまり立ち〜歩き出したら滑りにくい靴下を\n・ファーストシューズは歩き始めてから（11〜13cm）',
    sort_order: 18,
  },

  // ── その他 ──
  {
    stage_id: 'childcare', category_id: 'other', target_gender: 'both',
    title: 'お食い初め（100日祝い）を行う',
    description: '生後100日頃に赤ちゃんの食べ物に困らないよう祈る行事',
    tips: '・一汁三菜の祝い膳を用意（鯛、赤飯、お吸い物等）\n・「歯固め石」で丈夫な歯が生えるよう祈る\n・自宅でも料亭でも◎。最近は通販の祝い膳セットも人気\n・食べさせるマネだけ（実際には食べさせない）\n・記念写真を撮るいい機会',
    sort_order: 19,
  },
  {
    stage_id: 'childcare', category_id: 'other', target_gender: 'both',
    title: '初節句を祝う',
    description: '男の子は端午の節句（5月5日）、女の子はひな祭り（3月3日）',
    tips: '・兜や五月人形、雛人形は母方の祖父母が贈る慣習がある\n・コンパクトなものも多く出ている\n・ちらし寿司やちまき等の行事食\n・写真スタジオで記念撮影も\n・地域によって風習が異なるので家族で相談',
    sort_order: 20,
  },
  {
    stage_id: 'childcare', category_id: 'other', target_gender: 'both',
    title: '1歳の誕生日を祝う',
    description: '一升餅、選び取りなどの伝統行事',
    tips: '・一升餅を背負わせる（一生食べ物に困らないように）\n・選び取り：そろばん（商才）、筆（学問）、はさみ（手先が器用）等\n・スマッシュケーキも流行中（赤ちゃん用ケーキを手づかみ）\n・記念の手形・足形を残す\n・家族みんなで写真を撮ろう',
    sort_order: 21,
  },
  {
    stage_id: 'childcare', category_id: 'other', target_gender: 'both',
    title: '夫婦の時間・自分の時間を作る',
    description: '育児に追われても二人の時間を意識的に確保する',
    tips: '・月に1回は夫婦でのデートタイムを作る（一時保育を活用）\n・お互いの「ひとり時間」も大切にする\n・育児の不満は溜めず、定期的に話し合う場を設ける\n・「ありがとう」を意識的に伝え合う\n・完璧な親である必要はない。夫婦で協力しながら楽しむ',
    sort_order: 22,
  },
  {
    stage_id: 'childcare', category_id: 'other', target_gender: 'male',
    title: '育児に積極的に関わる',
    description: 'お風呂、寝かしつけ、公園遊びなど「担当」を持つ',
    tips: '・「手伝う」ではなく「一緒にやる」マインドが大切\n・沐浴→お風呂は父親の得意分野にしやすい\n・寝かしつけルーティンを確立すると母親の負担が減る\n・休日は積極的に子どもと二人で外出する\n・育児の判断を母親任せにせず、一緒に考える',
    sort_order: 23,
  },
  {
    stage_id: 'childcare', category_id: 'other', target_gender: 'both',
    title: '地域の子育て支援サービスに登録する',
    description: 'ファミリーサポート、子育て支援センター等',
    tips: '・ファミリーサポートセンター：地域の会員が預かってくれる（有料）\n・子育て支援センター：無料で遊べる場所、相談もできる\n・地域の子育てサークルに参加すると友達ができる\n・一時保育：リフレッシュ目的でもOK\n・民間のベビーシッターサービスも選択肢',
    sort_order: 24,
  },
];
