public class CircleMain {
    public static void main(String[] args) {
        Circle c1 = new Circle();
        Circle c2 = new Circle(2.5, "blue");

        System.out.println(c1);
        System.out.println("Área: " + c1.getArea());

        System.out.println(c2);
        System.out.println("Área: " + c2.getArea());
    }
}

