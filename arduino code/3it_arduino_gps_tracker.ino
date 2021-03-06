//includes libraries
#include <RTCZero.h>
#include <ArduinoLowPower.h>
#include <SigFox.h>
#include <TinyGPS++.h>
TinyGPSPlus gps;


const int transistor = 2;

//declaren van variablen
int frameid;
int long1length;
int long2length;
String longstr1;
String longstr2;
String longstr3;
String latstr1;
String latstr2;
String latstr3;
int sign = 0;
float gpslong = 0.0;
float gpslat = 0.0;


//trigger
unsigned long now = millis();
unsigned long lastTrigger = 0;
boolean startTimer = false;
const long apiinterval = 6000000;
unsigned long test = 0;



//setup functie
void setup() {
  pinMode (transistor, OUTPUT);
  //deze regel is nodig voor deepsleep te ontwaken
  
  LowPower.attachInterruptWakeup(RTC_ALARM_WAKEUP, alarmEvent0, CHANGE);
  Serial.begin(9600);
  Serial1.begin(9600);

  //handige voor testing, programma werkt niet voordat de serial openstaat. let hierbij wel op!
  //while (!Serial);
  //start sigfox, anders gaat hij heropstarten
  if ( ! SigFox.begin() ) {
    Serial.println("Error ... rebooting");
    NVIC_SystemReset();
    while (1);
  }
  SigFox.reset();
  delay(100);
  SigFox.debug();
  SigFox.end();

  // We need to have to time to program the Arduino after a reset
  // Otherwise it does not respond when in low-power mode
  Serial.println("Booting...");
}

//declareren van de sigfox messages
typedef struct __attribute__ ((packed)) sigfox_message {
  uint8_t frameidS1;
  uint8_t LatitudeS1;
  uint8_t LatitudeS2;
  uint8_t LatitudeS3;
  uint8_t LatitudeS4;
  uint8_t LongtitudeS1;
  uint8_t LongtitudeS2;
  uint8_t LongtitudeS3;
  uint8_t LongtitudeS4;
  uint8_t LongtitudeS5;
} SigfoxMessage;



//main loop functie
void loop() {
  digitalWrite (transistor, HIGH);
  // main code
  // word wakker van deepsleep
  Serial.println("ik ben terug wakker");
  // start sigfox
  SigFox.begin();
  SigFox.status();
  SigfoxMessage msg;

  //test locaties
  //float gpslong = -50.92657;
  //float gpslat = -4.86020;

  Serial.println("starten van while");
  while (gpslat == 0 && gpslong == 0) {
    while (Serial1.available()) {
      if (gps.encode(Serial1.read())) {
        // gps coordinaten (locatie)
        Serial.println("gpslocatie gevraagd");
        gpslat = gps.location.lat();
        gpslong = gps.location.lng();
        Serial.println(gpslat);
        Serial.println(gpslong);
      }
    }
  }

  //gps coordinaten van float to string, makkelijker om te splitsen op .
  String gpslongstr = String(gpslong, 5);
  String gpslatstr = String(gpslat, 5);
  //deel1 en deel2 voor en na de . split, longtitude
  String long1 = getValue(gpslongstr, '.', 0);
  String long2 = getValue(gpslongstr, '.', 1);
  //deel1 en deel2 voor en na de . split, latitude
  String lat1 = getValue(gpslatstr, '.', 0);
  String lat2 = getValue(gpslatstr, '.', 1);



  //long1length = long1.length();
  //if (long1length == 2) {
  //  long1 = "0"+long1;
  //  }
  //if (long1length == 1) {
  //  long1 = "00"+long1;
  //  }



  //opsplitsen van variable voor het doorsturen van sigfox message
  longstr1 = long2.substring(0, 2);
  longstr2 = long2.substring(2, 4);
  longstr3 = long2.substring(4, 5);
  latstr1 = lat2.substring(0, 2);
  latstr2 = lat2.substring(2, 4);
  latstr3 = lat2.substring(4, 5);



  //String variablen veranderen naar integers
  int longint = long1.toInt();
  int longint1 = longstr1.toInt();
  int longint2 = longstr2.toInt();
  int longint3 = longstr3.toInt();
  int latint = lat1.toInt();
  int latint1 = latstr1.toInt();
  int latint2 = latstr2.toInt();
  int latint3 = latstr3.toInt();



  //wanneer de coordinaten negatief zijn, geeft problemen in sigfox
  //daarom gebruiken we een sign veriablen
  //11 = zowel long als lat negatief
  //10 = enkel long negatief
  //01 = enkel lat negatief -> dit word in sigfox 1, haalt de nullen voor de integers weg -> minder communicatie
  //00 = beide negatief -> dit word in sigfox 0, haalt de nullen voor de integers weg -> minder communicatie
  if (gpslong < 0 && gpslat < 0) {
    sign = 11;
    longint = abs(longint);
    latint = abs(latint);
  }
  if (gpslong >= 0 && gpslat < 0) {
    sign = 01;
    longint = abs(longint);
    latint = abs(latint);
  }
  if (gpslong < 0 && gpslat >= 0) {
    sign = 10;
    longint = abs(longint);
    latint = abs(latint);
  }

  frameid=2;

  //test prints
  Serial.println("sign:");
  Serial.println(sign);
  Serial.println("longtitude:");
  Serial.println(longint);
  Serial.println(longint1);
  Serial.println(longint2);
  Serial.println(longint3);
  Serial.println("latitude:");
  Serial.println(latint);
  Serial.println(latint1);
  Serial.println(latint2);
  Serial.println(latint3);




  //variablen zetten in de sigfox message
  msg.frameidS1 = (int8_t)frameid;
  msg.LatitudeS1 = (uint8_t)latint;
  msg.LatitudeS2 = (int8_t)latint1;
  msg.LatitudeS3 = (int8_t)latint2;
  msg.LatitudeS4 = (int8_t)latint3;
  msg.LongtitudeS1 = (int8_t)longint;
  msg.LongtitudeS2 = (int8_t)longint1;
  msg.LongtitudeS3 = (int8_t)longint2;
  msg.LongtitudeS4 = (int8_t)longint3;
  msg.LongtitudeS5 = (int8_t)sign;




  //message wegschrijven/verzenden
  SigFox.beginPacket();
  SigFox.write((uint8_t*)&msg, sizeof(msg));
  //ACK van sigfox backend response/no response
  int ret = SigFox.endPacket(true);
  if (SigFox.parsePacket()) {
    Serial.println("Response from sigfox backend:");
    while (SigFox.available()) {
      Serial.print("0x");
      Serial.println(SigFox.read(), HEX);
    }
  } else {
    //Serial.println("No response from Sigfox backend");
  }
  SigFox.end();
  // Wait for 10 minutes.
  // Deepsleep
  digitalWrite (transistor, LOW);
  Serial.println("ik ga slapen");
  LowPower.sleep(600000);
}



void alarmEvent0() {
}



// dit is functie die gemaakt is om te kunnen splitsen op een separator
String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = { 0, -1 };
  int maxIndex = data.length() - 1;
  for (int i = 0; i <= maxIndex && found <= index; i++) {
    if (data.charAt(i) == separator || i == maxIndex) {
      found++;
      strIndex[0] = strIndex[1] + 1;
      strIndex[1] = (i == maxIndex) ? i + 1 : i;
    }
  }
  return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}
