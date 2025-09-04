import React, { useState } from 'react';
import { Button } from "@heroui/button";
import ActivityApprovalModal from './ActivityApprovalModal';

interface ActivityRecord {
  id: string;
  kodeLahan: string;
  namaLahan: string;
  aktivitas: string;
  fase: string;
  tanggalRencana: string;
  tanggalRealisasi: string;
  namaOperator: string;
  emailOperator: string;
  metadata: {
    cuaca: string;
    suhuUdara: number;
    kelembaban: number;
    kondisiTanah: string;
    pupukDigunakan?: string;
    pestisidaDigunakan?: string;
    catatanKhusus?: string;
    fotoAktivitas?: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  catatan?: string;
}

interface AktivitasTanamTableProps {
  data: ActivityRecord[];
  onApproval: (id: string, action: 'approved' | 'rejected', catatan: string) => void;
}

const AktivitasTanamTable: React.FC<AktivitasTanamTableProps> = ({ data, onApproval }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [preSelectedAction, setPreSelectedAction] = useState<'approved' | 'rejected' | undefined>(undefined);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openModal = (activity: ActivityRecord, action?: 'approved' | 'rejected') => {
    setSelectedActivity(activity);
    setPreSelectedAction(action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedActivity(null);
    setPreSelectedAction(undefined);
    setModalOpen(false);
  };

  const handleApproval = (id: string, action: 'approved' | 'rejected', catatan: string) => {
    onApproval(id, action, catatan);
  };

  const onQuickApprove = (activity: ActivityRecord) => {
    openModal(activity, 'approved');
  };

  const onQuickReject = (activity: ActivityRecord) => {
    openModal(activity, 'rejected');
  };

  const onDetailReview = (activity: ActivityRecord) => {
    openModal(activity);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: ActivityRecord['status']) => {
    const statusConfig = {
      pending: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-800 dark:text-amber-300',
        label: 'Menunggu Review'
      },
      approved: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-300',
        label: 'Disetujui'
      },
      rejected: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300',
        label: 'Ditolak'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getActionButtons = (activity: ActivityRecord) => {
    if (activity.status === 'pending') {
      return (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onPress={() => onQuickApprove(activity)}
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
          >
            ✓ Setujui
          </Button>
          <Button
            size="sm"
            onPress={() => onQuickReject(activity)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
          >
            ✗ Tolak
          </Button>
          <Button
            size="sm"
            onPress={() => onDetailReview(activity)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
          >
            👁 Review
          </Button>
        </div>
      );
    } else {
      return (
        <Button
          size="sm"
          onPress={() => onDetailReview(activity)}
          className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded"
        >
          👁 Lihat Detail
        </Button>
      );
    }
  };

  const getDaysDifference = (plannedDate: string, actualDate: string) => {
    const planned = new Date(plannedDate);
    const actual = new Date(actualDate);
    const diffTime = actual.getTime() - planned.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '✓ Tepat waktu';
    if (diffDays > 0) return `⚠️ Terlambat ${diffDays} hari`;
    return `✅ Lebih awal ${Math.abs(diffDays)} hari`;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">Tidak ada aktivitas ditemukan</h3>
          <p>Coba ubah filter atau kata kunci pencarian</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Kode & Lahan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Aktivitas & Fase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Jadwal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Operator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Kondisi & Metadata
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((activity: ActivityRecord) => (
              <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.kodeLahan}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.namaLahan}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.aktivitas}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.fase}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">Rencana:</span> {formatDate(activity.tanggalRencana)}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">Realisasi:</span> {formatDate(activity.tanggalRealisasi)}
                    </div>
                    <div className="text-xs mt-1">
                      {getDaysDifference(activity.tanggalRencana, activity.tanggalRealisasi)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.namaOperator}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(activity.createdAt)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm space-y-1">
                    <div className="text-gray-900 dark:text-white">
                      🌤️ {activity.metadata.cuaca}, {activity.metadata.suhuUdara}°C
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      💧 Kelembaban {activity.metadata.kelembaban}%
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      🌱 {activity.metadata.kondisiTanah}
                    </div>
                    {activity.metadata.pupukDigunakan && (
                      <div className="text-gray-500 dark:text-gray-400">
                        🧪 {activity.metadata.pupukDigunakan}
                      </div>
                    )}
                    {activity.metadata.catatanKhusus && (
                      <div className="text-gray-500 dark:text-gray-400 text-xs italic">
                        "{activity.metadata.catatanKhusus}"
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {getStatusBadge(activity.status)}
                    {activity.status !== 'pending' && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.status === 'approved' ? activity.approvedBy : activity.rejectedBy}
                        <br />
                        {formatDateTime(activity.status === 'approved' ? activity.approvedAt! : activity.rejectedAt!)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getActionButtons(activity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Approval Modal */}
      <ActivityApprovalModal
        isOpen={modalOpen}
        onClose={closeModal}
        activity={selectedActivity}
        onSubmit={handleApproval}
        preSelectedAction={preSelectedAction}
      />
    </div>
  );
};

export default AktivitasTanamTable;
