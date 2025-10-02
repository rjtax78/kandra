import API from "../services/api";
import Loader from "../components/Loader";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#9333ea"];

export default function Statistiques() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Statistiques</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h3 className="font-semibold mb-2">Opportunités par catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "Emploi", value: 40 },
                  { name: "Stage", value: 30 },
                  { name: "Formation", value: 20 },
                  { name: "Bénévolat", value: 10 },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow-md p-4 rounded-xl">
          <h3 className="font-semibold mb-2">Opportunités par mois</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { month: "Jan", count: 12 },
                { month: "Fév", count: 18 },
                { month: "Mar", count: 25 },
              ]}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
