public class AccountMain {
    public static void main(String[] args) {
        Account acc1 = new Account("1001", "Juan", 5000);
        Account acc2 = new Account("1002", "Ana", 2000);

        System.out.println(acc1);
        System.out.println(acc2);

        acc1.transferTo(acc2, 1500);

        System.out.println("Después de la transferencia:");
        System.out.println(acc1);
        System.out.println(acc2);
    }
}
