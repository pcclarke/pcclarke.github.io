import processing.core.*; 
import processing.xml.*; 

import guicomponents.*; 

import java.applet.*; 
import java.awt.Dimension; 
import java.awt.Frame; 
import java.awt.event.MouseEvent; 
import java.awt.event.KeyEvent; 
import java.awt.event.FocusEvent; 
import java.awt.Image; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 

public class TTMachineG4P2 extends PApplet {



ArrayList sentences, oldSentences;

GCheckbox[] selectCats;

GImageButton aboutButton, aboutClose, selectClear, selectRandom, createSlides, slideClose, slideBack, slideNext;

GWSlider inputNumber;

GLabel aboutText, tableTopic;

GWindow slideShow, about;

HashMap cats;

int currentSlide;

PFont chicago;

PImage bg;

public void setup()
{ 
  sentences = new ArrayList();
  oldSentences = new ArrayList();
  
  size(600, 500);
  smooth();
  
  bg = loadImage("machineBG.jpg");
  
  chicago = createFont("CHICAGO_.TTF", 30);
  
  String[] files = {"Nature", "Religion", "Robots", "Scientology", "Science", "Crime", "Pop", "Rap", "Rock", "Politics", "Coffee", "Fashion", "Star^Trek", "Star^Wars", "Hockey", "Home", "Economics", "Medicine"};
  selectCats = new GCheckbox[files.length];
  
  //----THE MENU----
  
  //NUMBER OF SLIDES SLIDER
  inputNumber = new GWSlider(this, 25, 175, 550);
  inputNumber.setValueType(GWSlider.INTEGER);
  inputNumber.setLimits(10, 1, 100);
  inputNumber.setFontColour(255);
  
  //About this Program Button
  String[] foiles = new String[]{"AboutButtonDefault.png", "AboutButtonMOver.png", "AboutButtonClicked.png"};
  aboutButton = new GImageButton(this, null, foiles, 540, 0);
  
  //Randomly Selected Categories Button
  foiles = new String[]{"RandomButtonDefault.png", "RandomButtonMOver.png", "RandomButtonClicked.png"};
  selectRandom = new GImageButton(this, null, foiles, 525, 265);
  
  //Clear Selected Categories Button
  foiles = new String[]{"ClearButtonDefault.png", "ClearButtonMOver.png", "ClearButtonClicked.png"};
  selectClear = new GImageButton(this, null, foiles, 450, 265);
  
  //CATEGORIES CHECKBOXES
  int pX = 25;
  int pY = 300;
  
  //Creates checkboxes by taking # of strings in "files" array
  for(int i = 0; i < files.length; i++)
  {
    selectCats[i] = new GCheckbox(this, files[i].replace('^', ' '), pX, pY, 25);
    selectCats[i].setColorScheme(7);
    if(pX + 100 > 600)
    {
      pX = 25;
      pY += 25;
    }
    else
    {
      pX += 100; 
    }
  }

  //CREATE SLIDES BUTTON  
  foiles = new String[]{"CreateButtonDefault.png", "CreateButtonMOver.png", "CreateButtonClicked.png"};
  createSlides = new GImageButton(this, null, foiles, 175, 425);
  
  //----LOAD THE CATEGORY FILES----
  cats = new HashMap();
  
  for (int i = 0; i < files.length; i++)
  {
    cats.put(files[i], new Category(files[i]));
  }
}

//************************************
//MAIN DRAW
//************************************
public void draw()
{
  background(100);
  image(bg, 0, 0);
  
  textFont(chicago);
  
  rectMode(CORNERS);
  fill(99, 127, 251, 150);
  noStroke();
  rect(0, 135, 600, 225);
  rect(0, 260, 600, 375);
  
  textAlign(CENTER);
  //fill(255);
  fill(109, 207, 246);
  textSize(20);
  text("The Amazing", 95, 45);
  
  textSize(45);
  text("TABLE TOPICS MACHINE", 300, 90);
  
  textAlign(LEFT);
  textSize(14);
  text("Number of slides to create", 25, 155);
  
  textSize(14);
  text("Categories used", 25, 280);
}

public void handleImageButtonEvents(GImageButton iButton)
{
  //The about window
  if(iButton == aboutButton && iButton.eventType == GButton.CLICKED)
  {
    about = new GWindow(this, "About the Table Topics Machine", 0, 0, 500, 650, false, JAVA2D);
    about.addDrawHandler(this, "drawController");
    
    String[] foiles = new String[]{"CloseButtonDefault.png", "CloseButtonMOver.png", "CloseButtonClicked.png"};
    aboutClose = new GImageButton(this, null, foiles, 0, 0);
    about.add(aboutClose);
    
    aboutText = new GLabel(this, "DEFAULT", 0, -250, 475, 600);
    aboutText.setFont("Arial", 10);
    aboutText.setColorScheme(7);
    String[] honky = loadStrings("about.txt");
    aboutText.setText(join(honky, "\n"));
    about.add(aboutText);
  }
  
  if(aboutClose == iButton && iButton.eventType == GButton.CLICKED)
  {
    about.close();
  }
    
  //Clear category checkboxes
  if(iButton == selectClear && iButton.eventType == GButton.CLICKED)
  {
    for(int i = 0; i < selectCats.length; i++)
    {
      selectCats[i].setSelected(false);
    }
  }
  
  //Select some checkboxes at random
  if(iButton == selectRandom && iButton.eventType == GButton.CLICKED)
  {
    int randy;
  
    for(int i = 0; i < selectCats.length; i++)
    {
      selectCats[i].setSelected(false);
        
      randy = PApplet.parseInt(random(0, 2));
      if(randy == 0)
      {
        selectCats[i].setSelected(true);
      }
      else
      {
        selectCats[i].setSelected(false);
      }
    }
  }
  
  if(iButton == createSlides && iButton.eventType == GButton.CLICKED)
  {
    ArrayList pickedCats = new ArrayList();
    boolean testy = false;
    
    //Determine which categories were selected
    for(int i = 0; i < selectCats.length; i++)
    {
      if(selectCats[i].isSelected() == true)
      {
        testy = true;
        String bubba = selectCats[i].getText();
        bubba = bubba.replace(' ', '^');
        pickedCats.add(bubba);
      }
    }
    
    //If the user was an idiot and didn't pick any categories, use them all
    if(testy == false)
    {
      for(int i = 0; i < selectCats.length; i++)
      {
        String bubba = selectCats[i].getText();
        bubba = bubba.replace(' ', '^');
        pickedCats.add(bubba);
      }
    }

    //Create a number of sentences
    for (int i = 0; i < inputNumber.getValue(); i++)
    {
      String boosh = generator(pickedCats, i);
      sentences.add(boosh);
    }
  
    slideShow = new GWindow(this, "My Cool Slides", 0, 0, screen.width, screen.height, false, JAVA2D);
    slideShow.addDrawHandler(this, "drawController");
    
    String[] foiles = new String[]{"CloseButtonDefault.png", "CloseButtonMOver.png", "CloseButtonClicked.png"};
    slideClose = new GImageButton(this, null, foiles, 0, 0);
    slideShow.add(slideClose);
    
    tableTopic = new GLabel(this, "DEFAULT", PApplet.parseInt(screen.width * 0.05f), PApplet.parseInt(screen.height * 0.1f), PApplet.parseInt(screen.width * .8f), PApplet.parseInt(screen.height * 0.5f));
    tableTopic.setFont("Arial", PApplet.parseInt(50 * screen.width/1440));
    tableTopic.setColorScheme(7);
    String honky = (String) sentences.get(0);
    tableTopic.setText(honky);
    slideShow.add(tableTopic);
    
    foiles = new String[]{"NextButtonDefault.png", "NextButtonMOver.png", "NextButtonClicked.png"};
    slideNext = new GImageButton(this, null, foiles, PApplet.parseInt(screen.width * .9f) - 100, PApplet.parseInt(screen.height * .8f));
    slideShow.add(slideNext);
    
    foiles = new String[]{"BackButtonDefault.png", "BackButtonMOver.png", "BackButtonClicked.png"};
    slideBack = new GImageButton(this, null, foiles, PApplet.parseInt(screen.width * .1f), PApplet.parseInt(screen.height * .8f));
    slideBack.setVisible(false);
    slideShow.add(slideBack);
   
    currentSlide = 0;
  }
  
  if(slideClose == iButton && iButton.eventType == GButton.CLICKED)
  {
    slideShow.close();
    sentences.clear();
  }
  
  if(slideNext == iButton && iButton.eventType == GButton.CLICKED && currentSlide + 1 < sentences.size())
  {
    if(currentSlide == 0)
    {
      slideBack.setVisible(true);
    }
    
    currentSlide++;
    
    String honky = (String) sentences.get(currentSlide);
    tableTopic.setText(honky);
    
    if(currentSlide + 1 == sentences.size())
    {
      slideNext.setVisible(false);
    }
  }
  
  if(slideBack == iButton && iButton.eventType == GButton.CLICKED && currentSlide > 0)
  {
    if(currentSlide + 1 == sentences.size())
    {
      slideNext.setVisible(true);
    }
    
    currentSlide--;
    
    String honky = (String) sentences.get(currentSlide);
    tableTopic.setText(honky);
    
    if(currentSlide == 0)
    {
      slideBack.setVisible(false);
    }
  }
}

public void handleCheckboxEvents(GCheckbox checkbox)
{ 
  //GO AWAY STUPID MESSAGE
}

public void handleSliderEvents(GSlider slider)
{ 
  //GO AWAY STUPID MESSAGE
}

//This only exists to give the window a colour
public void drawController(GWinApplet appc, GWinData data)
{
  appc.background(23, 30, 60);
}

//************************************
//SLIDE CREATION
//************************************

public String generator(ArrayList inputFiles, int seeder)
{
  ArrayList usedSentences = new ArrayList();
  ArrayList usedLibs = new ArrayList();
  ArrayList libCounter = new ArrayList();
  
  int randLib = 0;
  
  //Get all the sentences out from each used category
  for(int i = 0; i < inputFiles.size(); i++)
  {
    String filey = (String) inputFiles.get(i);
    Category pullCat = (Category) cats.get(filey);
    usedSentences.addAll(pullCat.returnSentences());
  }
  
  //Grab a sentence
  randomSeed(seeder + millis());
  String pickedSentence = (String) usedSentences.get(PApplet.parseInt(random(0, usedSentences.size())));
  
  //Check for, and replace used sentences
  for(int i = 0; i < 3; i++)
  {
    for(int j = 0; j < oldSentences.size(); j++)
    {
      String testSentence = (String) oldSentences.get(j);
      if(pickedSentence.equals(testSentence) == true)
      {
        if(i == 2)
        {
          oldSentences.clear();
        }
        pickedSentence = (String) usedSentences.get(PApplet.parseInt(random(0, usedSentences.size())));
      }
    }
  }
  oldSentences.add(pickedSentence);
  
  //If the sentence contains some keys after a %, add it to a list
  for(int i = 0; i < pickedSentence.length(); i++)
  {
    if(pickedSentence.charAt(i) == '%')
    {
      libCounter.add(pickedSentence.substring(i + 1, i + 7));
    }
  }
  
  //Go through each of the identified keys and replace wherever they occur in the sentence with a lib
  for(int i = 0; i < libCounter.size(); i++)
  {
    String pullCode = (String) libCounter.get(i);
    for(int j = 0; j < inputFiles.size(); j++)
    {
      String filey = (String) inputFiles.get(j);
      Category pullCat = (Category) cats.get(filey);
      if(pullCat.testCode(pullCode) == true)
      {
        usedLibs.addAll(pullCat.returnLibs(pullCode));
      }
    }
    randLib = PApplet.parseInt(random(0, usedLibs.size()));
    String pickedLib = (String) usedLibs.get(randLib);
    pickedSentence = pickedSentence.replace('%' + pullCode, pickedLib);
    usedLibs.clear();
  }
  
  return pickedSentence;
}
    
//******************************************************************
//Category Class - Stores the sentences and libs from the text files
//******************************************************************
class Category
{
  ArrayList sentences;
  HashMap hmLibs;
  String catName;

  Category (String inputCatName)
  {
    sentences = new ArrayList();
    hmLibs = new HashMap();
    this.catName = inputCatName;
    
    String[] catDump = loadStrings("categories/" + inputCatName.toLowerCase() + ".txt");
    //Go through each line in the .txt file
    
    for(int i = 0; i < catDump.length; i++)
    {
      if(catDump[i].startsWith("***",0) == false)
      {
        //If the line is a sentence, add it to the Sentences ArrayList
        if(catDump[i].startsWith("SEN_",0) == true)
        {
          sentences.add(catDump[i].substring(4, catDump[i].length()));
        }
        //If the line isn't a sentence or a category name...
        if(catDump[i].startsWith("CAT_", 0) == false && catDump[i].startsWith("SEN_", 0) == false)
        {
          //If the line's key has been added to the HashMap, add it to that key's ArrayList
          if(hmLibs.containsKey(catDump[i].substring(0, 6)) == true)
          {
            ArrayList tempLib = (ArrayList) hmLibs.get(catDump[i].substring(0, 6));
            tempLib.add(catDump[i].substring(7, catDump[i].length()));
          }
          //If the line's key has not been added to the HashMap, start a new ArrayList and add the line to it
          //(note the importance of keeping the keys together in the .txt file)
          else if(hmLibs.containsKey(catDump[i].substring(0, 6)) == false)
          {
            ArrayList tempLib = new ArrayList();
            tempLib.add(catDump[i].substring(7, catDump[i].length()));
            hmLibs.put(catDump[i].substring(0, 6), tempLib);
          }
        }
      }
    }
  }
  
  public boolean testCode(String inputCode)
  {
    if(hmLibs.get(inputCode) == null)
    {
      return false;
    }
    else
    {
      return true;
    }
  }
 
  public ArrayList returnLibs (String inputCode)
  {
    ArrayList collectLibs = (ArrayList) hmLibs.get(inputCode);
    return collectLibs;
  }
  
  public ArrayList returnSentences()
  {
    return sentences;
  }
}
  static public void main(String args[]) {
    PApplet.main(new String[] { "--bgcolor=#FFFFFF", "TTMachineG4P2" });
  }
}
