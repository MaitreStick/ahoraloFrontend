/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable quotes */
import {Layout, Text, Divider, Card} from "@ui-kitten/components";
import {StyleSheet} from "react-native";
import {Prodcomcity} from "../../../domain/entities/prodcomcity";
import {ScrollView} from "react-native-gesture-handler";
import {MyIcon} from "../../components/ui/MyIcon";

export const ProductInformationTab = ({
  prodcomcity,
}: {
  prodcomcity: Prodcomcity;
}) => {
  const {product, comcity, price, date} = prodcomcity;

  const dateObj = new Date(date);
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const formattedDate = `${dateObj.getFullYear()}-${String(
    dateObj.getMonth() + 1,
  ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(
    2,
    "0",
  )} a las ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

  return (
    <Layout style={styles.container}>
      <ScrollView>
        <Card style={styles.card} status="info">
          <Layout style={styles.header}>
            <MyIcon name="cube-outline" />
            <Text category="h6" style={styles.sectionTitle}>
              Información del Producto
            </Text>
          </Layout>
          <Divider style={styles.divider} />

          <Text category="s1" style={styles.label}>
            Nombre:
          </Text>
          <Text style={styles.value}>{product.title}</Text>

          <Text category="s1" style={styles.label}>
            Precio:
          </Text>
          <Text style={styles.value}>${price}</Text>

          <Text category="s1" style={styles.label}>
            Última actualización:
          </Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </Card>

        <Card style={styles.card} status="info">
          <Layout style={styles.header}>
            <MyIcon name="map-outline" />
            <Text category="h6" style={styles.sectionTitle}>
              Ubicación
            </Text>
          </Layout>
          <Divider style={styles.divider} />

          <Text category="s1" style={styles.label}>
            Ciudad:
          </Text>
          <Text style={styles.value}>{comcity.city.name}</Text>

          <Text category="s1" style={styles.label}>
            Departamento:
          </Text>
          <Text style={styles.value}>{comcity.city.nameDep}</Text>
        </Card>

        <Card style={styles.card} status="info">
          <Layout style={styles.header}>
            <MyIcon name="briefcase-outline" />
            <Text category="h6" style={styles.sectionTitle}>
              Información de la Empresa
            </Text>
          </Layout>
          <Divider style={styles.divider} />

          <Text category="s1" style={styles.label}>
            Empresa:
          </Text>
          <Text style={styles.value}>{comcity.company.name}</Text>
        </Card>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  divider: {
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    marginTop: 8,
  },
  value: {
    marginLeft: 8,
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
  },
});
