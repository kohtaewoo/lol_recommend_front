'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function HomePage() {
  const [riotId, setRiotId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!riotId.includes('#')) {
      alert('Riot ID 형식을 확인하세요 (예: Hideonbush#KR1)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/riot/check?riotId=${encodeURIComponent(riotId)}`);
      const data = await res.json();

      if (data.error || data.exists === false) {
        alert('존재하지 않는 소환사입니다.');
        setLoading(false);
        return;
      }

      router.push(`/result?riotId=${encodeURIComponent(riotId)}`);
    } catch (error) {
      console.error('서버 연결 실패:', error);
      alert('서버 연결 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white px-4 py-24 font-sans relative">

      {/* ✅ 네비게이션 버튼 2개 */}
      <motion.nav
        className="absolute top-6 right-6 flex gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <button onClick={() => router.push('/cluster')} className="nav-button">
          성향별 클러스터 보기
        </button>
        <button onClick={() => router.push('/all')} className="nav-button">
          전체 챔피언 보기
        </button>
      </motion.nav>

      {/* 타이틀 + 검색 */}
      <section className="flex flex-col items-center text-center mb-32">
        <motion.h1
          className="title-main"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          내 플레이 성향에 맞는<br className="hidden sm:block" /> LoL 챔피언 추천받기
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          플레이 스타일을 분석해 당신에게 꼭 맞는 라인별 챔피언을 추천해드립니다.
        </motion.p>

        <motion.div
          className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 px-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <input
            type="text"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
            placeholder="예: Hideonbush#KR1"
            className="input-primary"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className="button-primary"
            disabled={loading}
          >
            {loading ? '확인 중...' : '추천받기'}
          </button>
        </motion.div>

        <motion.p
          className="info-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          * 본 추천은 실제 숙련도 기반 분석을 바탕으로 합니다
        </motion.p>
      </section>

      {/* 설명 섹션 */}
      <section className="space-y-24 sm:space-y-32 py-16 sm:py-24 lg:py-32">
        {[
          { title: '📊 데이터 수집', desc: 'Riot API를 통해 골드~다이아 유저들의 챔피언 숙련도 데이터를 수집합니다.\n주요 챔피언을 기준으로 각 유저의 플레이 성향을 벡터화해 분석합니다.' },
          { title: '🧠 성향 분석', desc: 'K-means 클러스터링 알고리즘을 통해 유저들을 10가지 플레이 성향으로 분류합니다.\n각 유형은 고유의 스타일과 대표 챔피언을 가지고 있습니다.' },
          { title: '🎯 챔피언 추천', desc: '당신과 유사한 성향의 유저들이 자주 사용하는 챔피언을 분석하여\n포지션별 TOP 5 챔피언을 추천해드립니다.' }
        ].map((section, i) => (
          <motion.div
            key={section.title}
            className="section-wrapper"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            <h2 className="section-title">{section.title}</h2>
            <p className="section-desc whitespace-pre-line">{section.desc}</p>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
