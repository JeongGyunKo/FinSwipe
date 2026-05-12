export interface GAEventParams {
  // A. 인증 & 온보딩
  sign_up_completed: { 
    method: 'email' | 'google_oauth'; 
    time_to_complete_sec: number; 
  };
  login_completed: { 
    method: 'email' | 'google_oauth'; 
    is_first_login: boolean; 
  };
  onboarding_completed: { 
    total_tickers: number; 
    source: 'onboarding' | 'mypage'; 
  };
  portfolio_saved: {
    total_tickers: number;
    source: 'onboarding' | 'mypage';
  };

  // B. 메인 피드
  feed_viewed: { 
    total_decks: number; 
    total_tickers: number; 
    sort_method: 'time' | 'power'; 
  };
  feed_sort_changed: {
    from: 'time' | 'power';
    to: 'time' | 'power';
  };
  feed_refreshed: {
    new_decks_count: number;
    tickers_with_news: number;
  }
  card_viewed: { 
    news_id: string; 
    ticker: string; 
    sentiment_label: 'positive' | 'negative' | 'neutral' | 'mixed';
    sentiment_score: number;
    card_index: number;
    deck_size: number;
    is_push_entry: boolean;
  };
  card_swiped: { 
    news_id: string; 
    ticker: string; 
    direction: 'left' | 'right' | 'next'; 
    time_on_card_ms: number;
    card_index: number;
    swipe_method: 'gesture' | 'button';
  };
  card_tapped: { 
    news_id: string; 
    ticker: string; 
    sentiment_label: string;
    card_index: number;
  };
  deck_completed: { 
    ticker: string; 
    total_cards: number; 
    cards_consumed: number; 
    total_time_ms: number;
    taps_count: number;
  };  

  // C. 카드 상세
  detail_viewed: { 
    news_id: string; 
    ticker: string; 
    sentiment_label: string; 
    entry_source: 'card_tap' | 'push' | 'bookmark';
  };
  original_link_clicked: { 
    news_id: string; 
    ticker: string; 
    source_domain: string;
    time_on_detail_ms: number;
  };

  // D. 마이페이지
  mypage_menu_clicked: {
    menu_name: 'profile_edit' | 'portfolio' | 'settings' | 'help';
  }

  // E. 공통
  page_view: { 
    page_path: string; 
    page_title: string; 
  };
}