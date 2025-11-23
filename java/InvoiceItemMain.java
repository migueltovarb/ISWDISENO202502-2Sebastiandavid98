public class InvoiceItemMain {
    public static void main(String[] args) {
        InvoiceItem item = new InvoiceItem("A101", "Laptop", 2, 750.50);
        System.out.println(item);
        System.out.println("Total: " + item.getTotal());
    }
}
