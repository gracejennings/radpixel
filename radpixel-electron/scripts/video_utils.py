"""
** Shared Utility File **
Define functions that are useful for video processing here.
Be sure to provide some documentation.
"""

import numpy as np
import cv2
import matplotlib.pyplot as plt


# use this function to create a histogram that will help us decide on a threshold
# warning: this takes a while and is not that effective
def create_histogram(fname):
    bins = [i * 5 for i in range(0, 52)]

    cap = cv2.VideoCapture(fname)
    
    idx = 0
    while(cap.isOpened()):
        ret, frame = cap.read()
        if ret:
            if (idx == 0):
                hist = np.histogram(frame, bins)
            else:
                hist += np.histogram(frame, bins)
        else:
            break
            
        idx += 1
        
    cap.release()

    # aggregate histogram data from all frames
    values = hist[0]
    for i in range(2, len(hist), 2):
        values = np.add(values, hist[i])

    bins_to_omit = 4 # set this to reduce high values on the low end (which we don't care about)
    plt.bar(bins[bins_to_omit:-1],values[bins_to_omit:],width=5)
    plt.show()

# realtime histogram that lights up red when an event is detected
# NB: I have omitted the first 4 bins of the histogram (values 0-20) because the frequency is so unbalanced
# script also prints out the event count at the end
def realtime_histogram(fname, threshold):
    bins = [i * 5 for i in range(0, 52)]

    cap = cv2.VideoCapture(fname)
    FPS = 30 # 30 is mp4 std

    event_count = 0
    bins_to_omit = 3
    
    idx = 0
    while(cap.isOpened()):
        ret, frame = cap.read()
        if ret:
            # thresholding
            mask = np.where(frame > threshold, 255, 0).astype(np.uint8)
            lit = np.count_nonzero(mask)
            event_count += lit

            # histogram display
            hist, bin_edges = np.histogram(frame, bins)
            color = "blue" if lit < 1 else "red"
            plt.bar(bins[bins_to_omit:-1],hist[bins_to_omit:],width=5, color=color)
            plt.title('frame: ' + str(idx))

            # video display
            cv2.imshow('frame', frame)

            plt.pause(1/FPS)
            plt.cla() # reset
        else:
            break
            
        idx += 1

    cap.release()
    cv2.destroyAllWindows()
    print('Event count: ', event_count)
    plt.show()


def threshold_event_count(fname, threshold):
    event_count = 0

    cap = cv2.VideoCapture(fname)
    
    while(cap.isOpened()):
        ret, frame = cap.read()

        if ret:
            mask = np.where(frame > threshold, 255, 0).astype(np.uint8)
            event_count += np.count_nonzero(mask)
        else:
            break
        
    cap.release()

    return event_count

# turn the video into a numpy array
# output shape: [frame, height, width, channel]
# 4d cube = tesseract
def create_video_tesseract(fname):
    cap = cv2.VideoCapture(fname)
    frameCount = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frameWidth = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frameHeight = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    buf = np.empty((frameCount, frameHeight, frameWidth, 3), np.dtype('uint8'))

    fc = 0
    ret = True

    while (fc < frameCount  and ret):
        ret, buf[fc] = cap.read()
        fc += 1

    cap.release()

    return buf

