with open('test') as f1:
  with open('rets.php', 'a') as f2:

    Lines = f1.readlines()

    try:
      for line in Lines:
        item = line.strip().split(',')
        str = "\t" + "'" + item[0] + "' " + "=>" + " '" + item[1] + "'" + ","
        f2.write(str+"\n")
    except:
      print "error when open file!"
