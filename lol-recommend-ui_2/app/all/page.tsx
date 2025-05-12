'use client';

import ChampionCard from "../components/ChampionCard";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AllChampionsPage() {
  const router = useRouter();
  const [championList, setChampionList] = useState<string[]>([]);
  const [championFacePositions, setChampionFacePositions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [riotId, setRiotId] = useState('');

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const res = await fetch("https://ddragon.leagueoflegends.com/cdn/14.6.1/data/ko_KR/champion.json");
        const data = await res.json();
        setChampionList(Object.keys(data.data));
      } catch {
        console.error("챔피언 데이터를 불러오는 데 실패했습니다.");
      }
    };

    const fetchFacePositions = async () => {
      try {
        const res = await fetch("/data/champion_face_positions.json");
        const data = await res.json();
        setChampionFacePositions(data);
      } catch {
        console.error("face_positions.json 로드 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchChampions();
    fetchFacePositions();
  }, []);

  const handleSearch = async () => {
    if (!riotId.includes("#")) {
      alert("Riot ID 형식을 확인하세요 (예: Hideonbush#KR1)");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/riot/check?riotId=${encodeURIComponent(riotId)}`);
      const data = await res.json();

      if (data.error || data.exists === false) {
        alert("존재하지 않는 소환사입니다.");
        return;
      }

      router.push(`/result?riotId=${encodeURIComponent(riotId)}`);
    } catch {
      alert("서버 연결 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="page-wrapper">
      {/* 상단 네비게이션 – 홈으로 */}
      <motion.nav
        className="absolute top-6 right-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <button onClick={() => router.push("/")} className="nav-button">
          홈으로
        </button>
      </motion.nav>

      {/* 소환사 검색창 */}
      <div className="max-w-2xl mx-auto mt-6 mb-16">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
            placeholder="예: Hideonbush#KR1"
            className="input-primary"
          />
          <button onClick={handleSearch} className="button-primary">
            추천받기
          </button>
        </div>
      </div>

      {/* 타이틀 */}
      <motion.h1
        className="section-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        전체 챔피언 카드
      </motion.h1>

      {/* 챔피언 카드 */}
      {loading ? (
        <div className="loading-text">불러오는 중...</div>
      ) : (
        <motion.div
          className="champion-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {championList.map((champion) => {
            const position = championFacePositions[champion] || "center";
            return (
              <motion.div
                key={champion}
                transition={{ type: "spring", stiffness: 300 }}
                className="champion-card-box"
              >
                <ChampionCard name={champion} position={position} />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </main>
  );
}
