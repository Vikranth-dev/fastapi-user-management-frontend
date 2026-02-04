import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required chart components
ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

export default function TaskStatusChart({ analytics }) {
  const data = {
    labels: ["Total","Todo", "In Progress", "Done"],
    datasets: [
      {
        label: "Tasks Count",
        data: [
          analytics.total || 0,  
          analytics.Todo || 0,
          analytics["In Progress"] || 0,
          analytics.Done || 0,
        ],
        backgroundColor: ["#facc15", "#60a5fa", "#4ade80", "#f87171"],
      },
    ],
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false, // ensures chart fills container
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Tasks by Status" },
    tooltip: { enabled: true },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 }, // show integers only
    },
  },
};

  return <Bar data={data} options={options} />;
}
