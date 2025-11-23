public class EmployeeMain {
    public static void main(String[] args) {
        Employee e = new Employee(1, "Juan", "Pérez", 2000);
        System.out.println(e);
        System.out.println("Salario anual: " + e.getAnnualSalary());
        e.raiseSalary(10);
        System.out.println("Después de aumento: " + e.getSalary());
    }
}
