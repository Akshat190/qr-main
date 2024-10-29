import * as XLSX from 'xlsx';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  _id: string;
  timestamp: string | Date;
  tableNumber: number;
  totalPrice: number;
  items: OrderItem[];
  status: string;
}

export const generateOrdersExcel = (orders: Order[], restaurantName: string) => {
  // Format orders for Excel
  const formattedOrders = orders.map(order => ({
    'Order ID': order._id,
    'Date': new Date(order.timestamp).toLocaleDateString(),
    'Time': new Date(order.timestamp).toLocaleTimeString(),
    'Table Number': order.tableNumber,
    'Total Amount': `$${order.totalPrice.toFixed(2)}`,
    'Items': order.items.map((item: OrderItem) => 
      `${item.name} (x${item.quantity})`
    ).join(', '),
    'Status': order.status
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(formattedOrders);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');

  // Generate filename with restaurant name and month
  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const fileName = `${restaurantName}_Orders_${month}.xlsx`;

  // Save file
  XLSX.writeFile(wb, fileName);
}; 