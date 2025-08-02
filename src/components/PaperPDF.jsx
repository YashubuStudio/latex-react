// src/components/PaperPDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import NotoSansJP from "../fonts/NotoSansJP-Regular.ttf";

// 日本語フォント登録
Font.register({ family: "NotoSansJP", src: NotoSansJP });

const styles = StyleSheet.create({
  page: { padding: 40 },
  title: { fontFamily: "NotoSansJP", fontSize: 24, marginBottom: 12, textAlign: "center" },
  author: { fontFamily: "NotoSansJP", fontSize: 14, marginBottom: 8, textAlign: "center" },
  sectionTitle: { fontFamily: "NotoSansJP", fontSize: 16, marginTop: 16, marginBottom: 4 },
  body: { fontFamily: "NotoSansJP", fontSize: 12, marginBottom: 8 },
  figCaption: { fontFamily: "NotoSansJP", fontSize: 10, marginBottom: 8, textAlign: "center" },
  image: { width: 300, marginBottom: 4, alignSelf: "center" },
});

const PaperPDF = ({ title, author, abstract, sections, figures, reference }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>著者: {author}</Text>
      <Text style={styles.sectionTitle}>概要</Text>
      <Text style={styles.body}>{abstract}</Text>
      <Text style={styles.sectionTitle}>本文</Text>
      {sections.map((s, i) => (
        <View key={i}>
          <Text style={styles.sectionTitle}>{`${i + 1}. ${s.title}`}</Text>
          <Text style={styles.body}>{s.text}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>図</Text>
      {figures.map((fig, i) =>
        fig.dataUrl ? (
          <View key={i}>
            <Image src={fig.dataUrl} style={styles.image} />
            <Text style={styles.figCaption}>{`図${i + 1}: ${fig.caption}`}</Text>
          </View>
        ) : null
      )}
      <Text style={styles.sectionTitle}>参考文献</Text>
      <Text style={styles.body}>{reference}</Text>
    </Page>
  </Document>
);

export default PaperPDF;
