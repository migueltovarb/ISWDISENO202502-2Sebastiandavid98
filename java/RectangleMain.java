public class RectangleMain {
    public static void main(String[] args) {
        Rectangle r1 = new Rectangle();
        Rectangle r2 = new Rectangle(3.5f, 2.0f);

        System.out.println(r1);
        System.out.println("Área: " + r1.getArea() + " - Perímetro: " + r1.getPerimeter());

        System.out.println(r2);
        System.out.println("Área: " + r2.getArea() + " - Perímetro: " + r2.getPerimeter());
    }
}
