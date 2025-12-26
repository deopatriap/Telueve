"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EventData {
  id: number;
  nama_event: string;
  total_registrations: number;
  accepted_registrations: number;
  kuota_peserta: number;
}

interface RegistrationsChartProps {
  events: EventData[];
}

export default function RegistrationsChart({ events }: RegistrationsChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (events && events.length > 0) {
      // Sort by registrations desc, take top 5
      const sortedEvents = [...events]
        .sort((a, b) => b.total_registrations - a.total_registrations)
        .slice(0, 10);

      const labels = sortedEvents.map((e) => e.nama_event);
      const totalRegs = sortedEvents.map((e) => e.total_registrations);
      const acceptedRegs = sortedEvents.map((e) => e.accepted_registrations);

      setChartData({
        labels,
        datasets: [
          {
            label: "Total Registrations",
            data: totalRegs,
            backgroundColor: "rgba(211, 201, 183, 0.6)", // Nier cream
            borderColor: "rgba(211, 201, 183, 1)",
            borderWidth: 1,
            barThickness: 20,
          },
          {
            label: "Accepted",
            data: acceptedRegs,
            backgroundColor: "rgba(75, 75, 75, 0.6)", // Nier grey
            borderColor: "rgba(75, 75, 75, 1)",
            borderWidth: 1,
            barThickness: 20,
          },
        ],
      });
    }
  }, [events]);

  if (!chartData) return <div className="text-nier-dark/50 p-4">Loading Chart Data...</div>;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "'JetBrains Mono', monospace",
          },
          color: "#4b4b4b",
        },
      },
      title: {
        display: true,
        text: "Event Registration Analysis",
        font: {
          family: "'Outfit', sans-serif",
          size: 16,
        },
        color: "#2a2a2a",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        ticks: {
          font: {
            family: "'JetBrains Mono', monospace",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'JetBrains Mono', monospace",
          },
          // Truncate long labels
          callback: function (this: any, val: any, index: number) {
            const label = this.getLabelForValue(val) as string;
            return label.length > 15 ? label.substr(0, 15) + "..." : label;
          }
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] bg-white/50 backdrop-blur-sm p-4 rounded-sm border border-nier-dark/10">
      <Bar options={options as any} data={chartData} />
    </div>
  );
}
