'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ChampionCard from "../components/ChampionCard";
import { useRouter } from 'next/navigation';

const CLUSTER_FACE_POSITIONS_URL = '/data/champion_face_positions.json';

const clusterDescriptions = [
  {
    id: 0,
    title: '예측불가 플레이형',
    desc: '정형화된 틀보다, 나만의 방식으로 흐름을 바꾸는 걸 좋아하는 타입입니다.',
    champions: ['Shaco', 'Teemo', 'Briar'],
  },
  {
    id: 1,
    title: '손에 익은 몰입형',
    desc: '익숙한 챔프만 잡으면 몰입 끝. 감각에 몸을 맡기는 스타일입니다.',
    champions: ['Akali', 'Zed', 'Yone'],
  },
  {
    id: 2,
    title: '직진 전투형',
    desc: '복잡한 거 싫고, 정면에서 붙어서 이기는 맛으로 플레이합니다.',
    champions: ['Riven', 'Darius', 'Irelia'],
  },
  {
    id: 3,
    title: '감각 조율형',
    desc: '상황에 따라 자연스럽게 조율하며, 흐름을 부드럽게 이어갑니다.',
    champions: ['Lulu', 'Karma', 'Seraphine'],
  },
  {
    id: 4,
    title: '기본기 중심형',
    desc: '무리하지 않고 안정적으로, 팀의 중심을 잡아주는 플레이를 선호합니다.',
    champions: ['Sett', 'Aatrox', 'Jax'],
  },
  {
    id: 5,
    title: '순간 포착형',
    desc: '‘지금이야!’ 싶은 타이밍을 놓치지 않고 빠르게 전투를 열어버립니다.',
    champions: ['Samira', "Jinx", 'Aphelios'],
  },
  {
    id: 6,
    title: '그림 설계형',
    desc: '머릿속에 시나리오를 그리고, 흐름을 계획하며 이끄는 걸 좋아합니다.',
    champions: ['Kayn', 'Talon', 'Ekko'],
  },
  {
    id: 7,
    title: '지속 퍼포먼스형',
    desc: '조용히, 묵묵히, 꾸준히. 언뜻 안 보여도 결과로 말하는 타입입니다.',
    champions: ['Jinx', 'Ezreal', 'Ashe'],
  },
  {
    id: 8,
    title: '틈새 연결형',
    desc: '눈에 띄진 않아도 빈틈을 메우고 팀을 자연스럽게 이어주는 연결고리입니다.',
    champions: ['Leona', 'Nautilus', 'Alistar'],
  },
  {
    id: 9,
    title: '전장 전체형',
    desc: '눈앞의 싸움보다 전체 맵을 보며, 흐름을 설계하고 움직입니다.',
    champions: ['TwistedFate', 'Orianna', 'Viktor'],
  },
];

export default function ClusterPage() {
  const [facePositions, setFacePositions] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    fetch(CLUSTER_FACE_POSITIONS_URL)
      .then((res) => res.json())
      .then((data) => setFacePositions(data))
      .catch(() => console.error('champion_face_positions.json 로딩 실패'));
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-24">
      {/* 🔝 네비게이션 */}
      <motion.nav
        className="absolute top-6 right-6 flex gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <button onClick={() => router.push('/')} className="nav-button">
          홈으로
        </button>
        <button onClick={() => router.push('/all')} className="nav-button">
          전체 챔피언 보기
        </button>
      </motion.nav>

      {/* 📌 타이틀 */}
      <h1 className="section-title">플레이 성향별 클러스터</h1>

      <div className="space-y-24 max-w-6xl mx-auto">
        {clusterDescriptions.map((cluster) => (
          <motion.div
            key={cluster.id}
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: cluster.id * 0.1 }}
          >
            <div className="text-center">
              <h2 className="section-subtitle">🧩 Cluster {cluster.id} — {cluster.title}</h2>
              <p className="section-desc max-w-3xl mx-auto">{cluster.desc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 justify-items-center">
              {cluster.champions.map((champion) => (
                <ChampionCard
                  key={champion}
                  name={champion}
                  position={facePositions[champion] || 'center'}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
