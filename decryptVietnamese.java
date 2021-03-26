public class CheckVietNamese {

  // Sử dụng kiến thức về tiếng việt từ // https://mltav.asn.au/vietnamese/images/documents/Van/wa-van.pdf

  /* 
  Ý tưởng:
   B1: Tạo ra 26 bản decrypt từ ciphertext đầu vào
   B2: Tìm những tổ hợp phụ âm, nguyên âm, ... của tiếng việt trong từng bản decrypt
   B3: Tính điểm (dựa trên độ dài của tổ hợp tìm được) cho từng bản decrypt
   B4: Lấy bản decrypt có số điểm cao nhất.
   */

  static String phuam = "ch,gh,kh,ng,ngh,nh,ph,th,tr,gi,qu";
  static String banNguyenAm = "oa,oe,uy,ue";
  static String nguyenAm = "a,e,i,o,u,y";
  static String vanDonGian =
    "ic,ich,im,in,inh,ip,it,uc,un,ung,ut,um,up,ech,em,en,enh,ep,et,om,on,op,ot,ac,am,an,ang,ap,at,oc,ong,ec,eng,ach,anh";
  static String vanHoaAm = "eo,ao,ai,oi,eu,ia,iu,ui,uu,ua";
  static String vanHopAmLoai1 = "ay,au";
  static String vanHopAmLoai2 =
    "oac,oam,oan,oat,oang,uan,uat,uang,ieu,iec,iem,ien,iep,iet,ieng,yeu,yem,yen,uoi,uoc,uom,,uon,uop,uot,uong";

  public static void main(String[] args) {
    String ciphertext = "Dtys gtpy nly yza wpy nwlddczzx qtwp xl yrfzy, lys nsfa vpe bfl nslj, nzxxpye ctpyr vst yza mlt szln rst nsf eczyr xl yrfzy j efzyr wlx.";
    String ciphertext2 = "Zpuo cplu tbvu sht ihp WOHP JVTTLUA WBISPJ ov alu ahp ihp cpla uhf aybvj kl jhj zpuo cplu rohj ipla zv sbvun zpuo cplu khun sht.";

    System.out.println("1: " + ciphertext);
    System.out.println(CaesarCipher(ciphertext));

    System.out.println("\n\n2: " + ciphertext2);
    System.out.println(CaesarCipher(ciphertext2));
  }

  public static String CaesarCipher(String ciphertext) {
    String result = "";
    int bestScore = 0;

    for (int shift = 0; shift < 26; shift++) {
      String decrypttext = "";

      for (int i = 0; i < ciphertext.length(); i++) {
        char c = ciphertext.charAt(i);
        if (c == ' ' || c == ',' || c == '.') decrypttext += Character.toString(c);
        else if (Character.isUpperCase(c)) {
          char ch = (char)(((int) c + (26 - shift) - 65) % 26 + 65);
          decrypttext += Character.toString(ch);
        } else {
          char ch = (char)(((int) c + (26 - shift) - 97) % 26 + 97);
          decrypttext += Character.toString(ch);
        }
      }

      int score = checkVietNameseNoSpace(decrypttext);
      if (score > bestScore) {
        bestScore = score;
        result = decrypttext;
      }
    }

    return result;
  }

  public static int checkVietNameseNoSpace(String s) {
    int totalScore = 0;
    String str = s.toLowerCase();
    totalScore += GetScore(str, vanHopAmLoai2.split(","));
    totalScore += GetScore(str, vanDonGian.split(","));
    totalScore += GetScore(str, vanHopAmLoai1.split(","));
    totalScore += GetScore(str, vanHoaAm.split(","));
    totalScore += GetScore(str, banNguyenAm.split(","));
    totalScore += GetScore(str, phuam.split(","));

    return totalScore;
  }

  public static int GetScore(String str, String[] checker) {
    int score = 0;
    for (int i = 0; i < checker.length; i++) {
      if (str.indexOf(checker[i]) >= 0) {
        score += checker[i].length();
      }
    }
    return score;
  }
}