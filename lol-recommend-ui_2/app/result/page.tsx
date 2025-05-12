'use client';

import ChampionCard from "../components/ChampionCard";
import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  GiBroadsword,
  GiSpikedSnail,
  GiMagicSwirl,
  GiBullseye,
  GiAngelWings,
} from "react-icons/gi";
import { useSearchParams, useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const roles = ["Top", "Jungle", "Mid", "Bottom", "Support"];

const roleIcons: Record<string, React.ReactNode> = {
  Top: <GiBroadsword className="inline-block text-red-400 mr-2" />,
  Jungle: <GiSpikedSnail className="inline-block text-green-400 mr-2" />,
  Mid: <GiMagicSwirl className="inline-block text-purple-400 mr-2" />,
  Bottom: <GiBullseye className="inline-block text-yellow-300 mr-2" />,
  Support: <GiAngelWings className="inline-block text-blue-300 mr-2" />,
};

const roleBackgrounds: Record<string, string> = {
  Top: "from-red-900/60 to-black/80",
  Jungle: "from-green-900/60 to-black/80",
  Mid: "from-purple-900/60 to-black/80",
  Bottom: "from-yellow-800/60 to-black/80",
  Support: "from-blue-900/60 to-black/80",
};

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const riotId = searchParams.get("riotId") || "";
  const [searchValue, setSearchValue] = useState(riotId);
  const [championFacePositions, setChampionFacePositions] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Record<string, string[]>>({});
  const [inputChampions, setInputChampions] = useState<string[]>([]);
  const [clusterTitle, setClusterTitle] = useState<string>("");
  const [clusterDesc, setClusterDesc] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setRecommendations({});
      setInputChampions([]);
      setClusterTitle("");
      setClusterDesc("");

      try {
        const checkRes = await fetch(`${BACKEND_URL}/api/riot/check?riotId=${encodeURIComponent(riotId)}`);
        const checkData = await checkRes.json();

        if (checkData.error || checkData.exists === false) {
          alert("존재하지 않는 소환사입니다.");
          router.push("/");
          return;
        }
      } catch {
        alert("서버와의 연결에 실패했습니다.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/riot/recommend?riotId=${encodeURIComponent(riotId)}`);
        const data = await res.json();

        setRecommendations(data.recommendations || {});
        setInputChampions(data.inputChampions || []);
        setClusterTitle(data.clusterTitle || "");
        setClusterDesc(data.clusterDesc || "");
      } catch {
        alert("추천 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(championFacePositions).length === 0) {
      fetch("/data/champion_face_positions.json")
        .then((res) => res.json())
        .then((data) => setChampionFacePositions(data));
    }

    if (riotId) {
      fetchData();
    }
  }, [riotId, router]);

  const handleSearch = () => {
    if (!searchValue.includes("#")) {
      alert("Riot ID 형식을 확인하세요 (예: Hideonbush#KR1)");
      return;
    }
    router.push(`/result?riotId=${encodeURIComponent(searchValue)}`);
  };

  return (
    <main className="page-wrapper">
      <motion.nav className="absolute top-6 right-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <button onClick={() => router.push("/")} className="nav-button">
          홈으로
        </button>
      </motion.nav>

      <div className="max-w-2xl mx-auto mb-16">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="예: Hideonbush#KR1"
            className="input-primary"
          />
          <button onClick={handleSearch} className="button-primary">
            추천받기
          </button>
        </div>
      </div>

      <motion.h1 className="section-title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        라인별 추천 챔피언
      </motion.h1>

      {loading ? (
        <div className="loading-text">불러오는 중...</div>
      ) : (
        <>
          <div className="text-center mb-20 space-y-5">
            <p className="recommend-summary-title">
              🎯 Riot ID <span className="text-yellow-300">&lsquo;{riotId}&rsquo;</span>는 →
              <span className="text-emerald-400 font-extrabold"> &quot;{clusterTitle}&quot;</span> 유형입니다.
            </p>
            <p className="recommend-summary-desc">💬 {clusterDesc}</p>
          </div>

          {inputChampions.length > 0 && (
            <div className="input-champion-section">
              <h2 className="input-champion-title">🎮 입력된 챔피언</h2>
              <div className="input-champion-list">
                {inputChampions.map((champ) => {
                  const position = championFacePositions[champ] || "center";
                  return (
                    <div key={champ} className="input-champion-card">
                      <ChampionCard name={champ} position={position} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-28">
            {roles.map((role, idx) => (
              <section key={role}>
                <motion.div className={`role-section-header ${roleBackgrounds[role]}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.2 }}>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
                    {roleIcons[role]} {role}
                  </h2>
                </motion.div>

                <motion.div className="role-champion-grid" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                  {(recommendations[role] || []).map((champion) => {
                    const position = championFacePositions[champion] || "center";
                    return (
                      <motion.div key={champion} className="champion-card-box">
                        <ChampionCard name={champion} position={position} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default function SuspenseWrappedResultPage() {
  return (
    <Suspense fallback={<div className="loading-text">로딩 중...</div>}>
      <ResultContent />
    </Suspense>
  );
}
